/**
 * Connect Metrics Helper: page-world capture script.
 *
 * Runs in the page's own JavaScript world (manifest "world": "MAIN", run_at document_start) as a
 * plain, synchronous script, so window.fetch is wrapped before any page script runs.
 *
 * The Connect admin website fetches phone numbers, email addresses and their flow associations
 * from internal endpoints that reject requests made by anyone but the page itself. Rather than
 * replicate those calls, this script watches the page's own fetch responses and forwards a reduced
 * copy (phone number / email address <-> resource ARN, resource ARN <-> flow ARN) to the extension's
 * content script via window.postMessage. Nothing is sent anywhere else and responses are never
 * modified.
 *
 * Kept as hand-written plain JS on purpose: the bundler's content-script loader is asynchronous,
 * which would race the page's first requests.
 */
(function () {
  'use strict';
  if (window.__cmhCaptureInstalled) return;
  window.__cmhCaptureInstalled = true;

  var SOURCE = 'connect-metrics-helper';
  var originalFetch = window.fetch;
  if (typeof originalFetch !== 'function') return;

  function post(type, items) {
    window.postMessage({ source: SOURCE, type: type, items: items }, location.origin);
  }

  function handle(url, response) {
    var path;
    try {
      path = new URL(url, location.href).pathname;
    } catch (e) {
      return;
    }
    var isNumbers = path.indexOf('/api-proxy/connect/phone-number/list') !== -1;
    var isEmails = path.indexOf('/api-proxy/connect/search-email-addresses') !== -1;
    var isAssoc = path.indexOf('/api-proxy/connect/flow-associations-batch/') !== -1;
    if (!isNumbers && !isEmails && !isAssoc) return;
    response
      .clone()
      .json()
      .then(function (body) {
        if (!body || typeof body !== 'object') return;
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
      })
      .catch(function () {
        /* not JSON or body unavailable: ignore */
      });
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
