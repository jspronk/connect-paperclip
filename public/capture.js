/**
 * Connect Paperclip: page-world capture script.
 *
 * Runs in the page's own JavaScript world (manifest "world": "MAIN", run_at document_start) as a
 * plain, synchronous script, so window.fetch and XMLHttpRequest are wrapped before any page script runs.
 *
 * The Connect admin website fetches phone numbers, email addresses, users and flow associations
 * from internal endpoints that reject requests made by anyone but the page itself. Rather than
 * replicate those calls, this script watches the page's own fetch/XHR responses and forwards a
 * reduced copy (phone number / email address <-> resource ARN, resource ARN <-> flow ARN,
 * username <-> routing profile id/name) to the extension's content script via window.postMessage.
 * Nothing is sent anywhere else and responses are never modified.
 *
 * Kept as hand-written plain JS on purpose: the bundler's content-script loader is asynchronous,
 * which would race the page's first requests.
 */
(function () {
  'use strict';
  if (window.__cmhCaptureInstalled) return;
  window.__cmhCaptureInstalled = true;

  var SOURCE = 'connect-paperclip';
  var originalFetch = window.fetch;
  if (typeof originalFetch !== 'function') return;

  function post(type, items) {
    window.postMessage({ source: SOURCE, type: type, items: items }, location.origin);
  }

  function pathOf(url) {
    try {
      return new URL(url, location.href).pathname;
    } catch (e) {
      return '';
    }
  }

  function isInteresting(path) {
    return (
      path.indexOf('/api-proxy/connect/phone-number/list') !== -1 ||
      path.indexOf('/api-proxy/connect/search-email-addresses') !== -1 ||
      path.indexOf('/api-proxy/connect/flow-associations-batch/') !== -1 ||
      path.indexOf('/user-management/search-users') !== -1
    );
  }

  function handleBody(path, body) {
    if (!body || typeof body !== 'object') return;
    var isNumbers = path.indexOf('/api-proxy/connect/phone-number/list') !== -1;
    var isEmails = path.indexOf('/api-proxy/connect/search-email-addresses') !== -1;
    var isAssoc = path.indexOf('/api-proxy/connect/flow-associations-batch/') !== -1;
    var isUsers = path.indexOf('/user-management/search-users') !== -1;
    var i, n, a, items;
    if (isNumbers && Array.isArray(body.ListPhoneNumbersSummaryList)) {
      items = [];
      for (i = 0; i < body.ListPhoneNumbersSummaryList.length; i++) {
        n = body.ListPhoneNumbersSummaryList[i];
        if (n && typeof n.PhoneNumber === 'string' && typeof n.PhoneNumberArn === 'string') {
          items.push({ number: n.PhoneNumber, arn: n.PhoneNumberArn });
        }
      }
      post('phone-numbers', items);
    } else if (isEmails) {
      // SearchEmailAddresses shape: { EmailAddresses: [{ EmailAddress, EmailAddressArn, ... }] }.
      // Look through top-level arrays so a renamed list key still works.
      items = [];
      var keys = Object.keys(body);
      for (var k = 0; k < keys.length; k++) {
        var list = body[keys[k]];
        if (!Array.isArray(list)) continue;
        for (i = 0; i < list.length; i++) {
          var e = list[i];
          if (e && typeof e.EmailAddress === 'string' && typeof e.EmailAddressArn === 'string') {
            items.push({ address: e.EmailAddress, arn: e.EmailAddressArn });
          }
        }
      }
      if (items.length) post('email-addresses', items);
    } else if (isUsers && Array.isArray(body.UserList)) {
      // User management list: each user carries { RoutingProfile: { Id, Arn, Name } }.
      items = [];
      for (i = 0; i < body.UserList.length; i++) {
        var u = body.UserList[i];
        var rp = u && u.RoutingProfile;
        if (u && typeof u.Username === 'string' && rp && typeof rp.Id === 'string') {
          items.push({ username: u.Username, routingProfileId: rp.Id, routingProfileName: typeof rp.Name === 'string' ? rp.Name : '' });
        }
      }
      if (items.length) post('users', items);
    } else if (isAssoc && Array.isArray(body.FlowAssociationSummaryList)) {
      items = [];
      for (i = 0; i < body.FlowAssociationSummaryList.length; i++) {
        a = body.FlowAssociationSummaryList[i];
        if (a && typeof a.ResourceId === 'string' && typeof a.FlowId === 'string') {
          items.push({ resourceArn: a.ResourceId, flowArn: a.FlowId, resourceType: String(a.ResourceType || '') });
        }
      }
      post('flow-associations', items);
    }
  }

  /** fetch(): clone the response and parse it off the page's critical path. */
  function handle(url, response) {
    var path = pathOf(url);
    if (!isInteresting(path)) return;
    response
      .clone()
      .json()
      .then(function (body) {
        handleBody(path, body);
      })
      .catch(function () {
        /* not JSON or body unavailable: ignore */
      });
  }

  /** XMLHttpRequest: some console micro-frontends (e.g. Email addresses) use XHR instead of fetch. */
  function handleXhr(xhr) {
    var path = pathOf(xhr.__cmhUrl || '');
    if (!isInteresting(path)) return;
    try {
      var rt = xhr.responseType;
      if (rt === 'json') {
        handleBody(path, xhr.response);
      } else if (rt === '' || rt === 'text') {
        handleBody(path, JSON.parse(xhr.responseText));
      } else if (rt === 'arraybuffer' && xhr.response) {
        // The Email addresses micro-frontend requests binary bodies and decodes them itself.
        handleBody(path, JSON.parse(new TextDecoder('utf-8').decode(xhr.response)));
      } else if (rt === 'blob' && xhr.response && typeof xhr.response.text === 'function') {
        xhr.response
          .text()
          .then(function (text) {
            handleBody(path, JSON.parse(text));
          })
          .catch(function () {
            /* ignore */
          });
      }
    } catch (e) {
      /* not JSON: ignore */
    }
  }

  var xhrOpen = XMLHttpRequest.prototype.open;
  var xhrSend = XMLHttpRequest.prototype.send;
  if (typeof xhrOpen === 'function' && typeof xhrSend === 'function') {
    XMLHttpRequest.prototype.open = function (method, url) {
      try {
        this.__cmhUrl = typeof url === 'string' ? url : String(url);
      } catch (e) {
        /* ignore */
      }
      return xhrOpen.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function () {
      try {
        if (this.__cmhUrl && isInteresting(pathOf(this.__cmhUrl))) {
          this.addEventListener('load', function () {
            handleXhr(this);
          });
        }
      } catch (e) {
        /* never interfere with the page */
      }
      return xhrSend.apply(this, arguments);
    };
  }

  window.fetch = function (input, init) {
    var result = originalFetch.apply(this, arguments);
    try {
      var url = typeof input === 'string' ? input : input && input.url ? input.url : String(input);
      result.then(function (res) {
        handle(url, res);
      }, function () {});
    } catch (e) {
      /* never interfere with the page */
    }
    return result;
  };
})();
