

# Outbound campaign metrics in Connect Customer
<a name="outbound-campaign-metrics"></a>

The following outbound campaign driven metrics are available on the [outbound campaigns performance dashboard](outbound-campaigns-performance-dashboard.md) and by using the GetMetricDataV2 API. 

## Average dials per minute
<a name="average-dials-hmetric"></a>

This metric measures the average number of outbound campaign dials per minute for the specified start time and end time.

**Metric type**: Double

**Metric category**: Outbound campaigns driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `AVG_DIALS_PER_MINUTE`

**How to access using the Connect Customer admin website**: 
+ Dashboard: [Outbound campaigns performance dashboard](outbound-campaigns-performance-dashboard.md), Avg. dials per minute

**Notes**:
+ This metric is available only for outbound campaigns that use the agent assisted voice and automated voice delivery modes.
+ Data for this metric is available starting from June 25, 2024 0:00:00 GMT.

## Average wait time after customer connection
<a name="average-wait-time-hmetric"></a>

This metric measures the average duration of total wait time by the customer after they answer the outbound call through the Connect Customer dialer. 

**Metric type**: String (*hh:mm:ss*)

**Metric category**: Outbound campaigns driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `AVG_WAIT_TIME_AFTER_CUSTOMER_CONNECTION`

**Notes**:
+ This metric is available only for outbound campaigns that use the agent assisted voice and automated voice delivery modes.
+ Data for this metric is available starting from June 25, 2024 0:00:00 GMT.

## Campaign contacts abandoned after X
<a name="campaign-contacts-abandoned-hmetric"></a>

This metric counts the outbound campaign calls that were connected to a live customer but did not get connected to an agent within X seconds. The possible values for X are from 1 to 604800 inclusive. This metric is only available with answering machine detection enabled. For more information about answering machine detection, see [Best practices for answering machine detection](campaign-best-practices.md#machine-detection). 

**Metric type**: Integer

**Metric category**: Outbound campaigns driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `CAMPAIGN_CONTACTS_ABANDONED_AFTER_X`

**How to access using the Connect Customer admin website**: 
+ Dashboard: [Outbound campaigns performance dashboard](outbound-campaigns-performance-dashboard.md), Campaign contacts abandoned after x seconds rate

**Notes**:
+ This metric is available only for outbound campaigns using the agent assisted voice and automated voice delivery modes.
+ Data for this metric is available starting from June 25, 2024 0:00:00 GMT.

## Campaign contacts abandoned after X rate
<a name="campaign-contacts-abandoned-rate-hmetric"></a>

This metric measures the percentage of outbound campaign calls that were connected to a live customer but did not get connected to an agent within X seconds divided by the count of contacts connected to a live customer in an outbound campaign. The possible values for X are from 1 to 604800 inclusive. 

**Metric type**: Percent
+ Min value: 0.00%
+ Min value: 100.00%

**Metric category**: Outbound campaigns driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `CAMPAIGN_CONTACTS_ABANDONED_AFTER_X_RATE`

**How to access using the Connect Customer admin website**: 
+ Dashboard: [Outbound campaigns performance dashboard](outbound-campaigns-performance-dashboard.md), Campaign contacts abandoned rate

**Notes**:
+ This metric is only available with answering machine detection enabled. For more information about answering machine detection, see [Best practices for answering machine detection](campaign-best-practices.md#machine-detection). This metric is available only for outbound campaigns using the agent assisted voice and automated voice delivery modes.
+ Data for this metric is available starting from June 25, 2024 0:00:00 GMT.

## Campaign contacts abandoned after X from greeting end
<a name="campaign-contacts-abandoned-greeting-end-hmetric"></a>

This metric counts the outbound campaign calls that were connected to a live customer but did not get connected to an agent within X seconds from the greeting end timestamp. The greeting end timestamp marks when the outbound greeting message finished playing to the customer. The possible values for X are from 1 to 604800 inclusive.

**Metric type**: Integer

**Metric category**: Outbound campaigns driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `CAMPAIGN_CONTACTS_ABANDONED_AFTER_X_FROM_GREETING_END`

**How to access using the Connect Customer admin website**: 
+ Dashboard: [Outbound campaigns performance dashboard](outbound-campaigns-performance-dashboard.md), Campaign contacts abandoned after x from greeting end seconds rate
+ For AMD-enabled campaigns, only contacts with an answering machine detection status of `HUMAN_ANSWERED` are counted. For AMD-disabled campaigns, all connected contacts are counted.
+ This metric is available only for outbound campaigns using the agent assisted voice delivery mode.
+ Data for this metric is available starting from June 29, 2026, 04:43:45 UTC.

## Campaign contacts abandoned after X from greeting end rate
<a name="campaign-contacts-abandoned-greeting-end-rate-hmetric"></a>

This metric measures the percentage of outbound campaign calls that were connected to a live customer but did not get connected to an agent within X seconds from the greeting end timestamp, divided by the count of eligible connected campaign contacts. The possible values for X are from 1 to 604800 inclusive.

**Metric type**: Percent
+ Min value: 0.00%
+ Max value: 100.00%

**Metric category**: Outbound campaigns driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `CAMPAIGN_CONTACTS_ABANDONED_AFTER_X_FROM_GREETING_END_RATE`

**How to access using the Connect Customer admin website**: 
+ Dashboard: [Outbound campaigns performance dashboard](outbound-campaigns-performance-dashboard.md), Campaign contacts abandoned after x from greeting end seconds rate

**Calculation logic**:
+ (Campaign contacts abandoned after X from greeting end / Campaign contacts connected) \* 100.0
+ For AMD-enabled campaigns, only contacts with an answering machine detection status of `HUMAN_ANSWERED` are counted in both the numerator and denominator. For AMD-disabled campaigns, all connected contacts are counted.
+ This metric is available only for outbound campaigns using the agent assisted voice delivery mode.
+ Data for this metric is available starting from June 29, 2026, 04:43:45 UTC.

## Campaign contacts abandoned after X from greeting start
<a name="campaign-contacts-abandoned-greeting-start-hmetric"></a>

This metric counts the outbound campaign calls that were connected to a live customer but did not get connected to an agent within X seconds from the greeting start timestamp. The greeting start timestamp marks when the outbound greeting message began playing to the customer. The possible values for X are from 1 to 604800 inclusive.

**Metric type**: Integer

**Metric category**: Outbound campaigns driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `CAMPAIGN_CONTACTS_ABANDONED_AFTER_X_FROM_GREETING_START`

**How to access using the Connect Customer admin website**: 
+ Dashboard: [Outbound campaigns performance dashboard](outbound-campaigns-performance-dashboard.md), Campaign contacts abandoned after x from greeting start seconds rate
+ For AMD-enabled campaigns, only contacts with an answering machine detection status of `HUMAN_ANSWERED` are counted. For AMD-disabled campaigns, all connected contacts are counted.
+ This metric is available only for outbound campaigns using the agent assisted voice delivery mode.
+ Data for this metric is available starting from June 29, 2026, 04:43:45 UTC.

## Campaign contacts abandoned after X from greeting start rate
<a name="campaign-contacts-abandoned-greeting-start-rate-hmetric"></a>

This metric measures the percentage of outbound campaign calls that were connected to a live customer but did not get connected to an agent within X seconds from the greeting start timestamp, divided by the count of eligible connected campaign contacts. The possible values for X are from 1 to 604800 inclusive.

**Metric type**: Percent
+ Min value: 0.00%
+ Max value: 100.00%

**Metric category**: Outbound campaigns driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `CAMPAIGN_CONTACTS_ABANDONED_AFTER_X_FROM_GREETING_START_RATE`

**How to access using the Connect Customer admin website**: 
+ Dashboard: [Outbound campaigns performance dashboard](outbound-campaigns-performance-dashboard.md), Campaign contacts abandoned after x from greeting start seconds rate

**Calculation logic**:
+ (Campaign contacts abandoned after X from greeting start / Campaign contacts connected) \* 100.0
+ For AMD-enabled campaigns, only contacts with an answering machine detection status of `HUMAN_ANSWERED` are counted in both the numerator and denominator. For AMD-disabled campaigns, all connected contacts are counted.
+ This metric is available only for outbound campaigns using the agent assisted voice delivery mode.
+ Data for this metric is available starting from June 29, 2026, 04:43:45 UTC.

## Campaign contacts abandoned after X from system connection
<a name="campaign-contacts-abandoned-system-connection-hmetric"></a>

This metric counts the outbound campaign calls that were connected to a live customer but did not get connected to an agent within X seconds from the system connection timestamp. The system connection timestamp marks when the outbound call was connected to the Connect Customer system (before greeting or agent connection). The possible values for X are from 1 to 604800 inclusive.

**Metric type**: Integer

**Metric category**: Outbound campaigns driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `CAMPAIGN_CONTACTS_ABANDONED_AFTER_X_FROM_SYSTEM_CONNECTION`

**How to access using the Connect Customer admin website**: 
+ Dashboard: [Outbound campaigns performance dashboard](outbound-campaigns-performance-dashboard.md), Campaign contacts abandoned after x from system connection seconds rate
+ For AMD-enabled campaigns, only contacts with an answering machine detection status of `HUMAN_ANSWERED` are counted. For AMD-disabled campaigns, all connected contacts are counted.
+ This metric is available only for outbound campaigns using the agent assisted voice delivery mode.
+ Data for this metric is available starting from June 29, 2026, 04:43:45 UTC.

## Campaign contacts abandoned after X from system connection rate
<a name="campaign-contacts-abandoned-system-connection-rate-hmetric"></a>

This metric measures the percentage of outbound campaign calls that were connected to a live customer but did not get connected to an agent within X seconds from the system connection timestamp, divided by the count of eligible connected campaign contacts. The possible values for X are from 1 to 604800 inclusive.

**Metric type**: Percent
+ Min value: 0.00%
+ Max value: 100.00%

**Metric category**: Outbound campaigns driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `CAMPAIGN_CONTACTS_ABANDONED_AFTER_X_FROM_SYSTEM_CONNECTION_RATE`

**How to access using the Connect Customer admin website**: 
+ Dashboard: [Outbound campaigns performance dashboard](outbound-campaigns-performance-dashboard.md), Campaign contacts abandoned after x from system connection seconds rate

**Calculation logic**:
+ (Campaign contacts abandoned after X from system connection / Campaign contacts connected) \* 100.0
+ For AMD-enabled campaigns, only contacts with an answering machine detection status of `HUMAN_ANSWERED` are counted in both the numerator and denominator. For AMD-disabled campaigns, all connected contacts are counted.
+ This metric is available only for outbound campaigns using the agent assisted voice delivery mode.
+ Data for this metric is available starting from June 29, 2026, 04:43:45 UTC.

## Campaign contacts connected
<a name="campaign-contacts-connected-hmetric"></a>

This metric counts the outbound campaign contacts that were connected to the Connect Customer system and are eligible for abandonment rate calculation. For AMD-enabled campaigns, only contacts with an answering machine detection status of `HUMAN_ANSWERED` are counted. For AMD-disabled campaigns, all connected contacts are counted.

**Metric type**: Integer

**Metric category**: Outbound campaigns driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `CAMPAIGN_CONTACTS_CONNECTED`

**How to access using the Connect Customer admin website**: 
+ Dashboard: [Outbound campaigns performance dashboard](outbound-campaigns-performance-dashboard.md), Campaign contacts connected
+ For AMD-enabled campaigns, only contacts with an answering machine detection status of `HUMAN_ANSWERED` are counted. For AMD-disabled campaigns (where the answering machine detection status field is absent), all connected contacts are counted.
+ This metric is available only for outbound campaigns using the agent assisted voice delivery mode.
+ Data for this metric is available starting from June 29, 2026, 04:43:45 UTC.

## Campaign interactions
<a name="campaign-interactions-hmetric"></a>

This metric counts the outbound campaign interactions after a successful delivery attempt. Example interactions include `Open`, `Click`, and `Complaint`. 

**Metric type**: Integer

**Metric category**: Outbound campaigns driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `CAMPAIGN_INTERACTIONS`
+ Dashboard: [Outbound campaigns performance dashboard](outbound-campaigns-performance-dashboard.md) 

**Notes**:
+ This metric is available only for outbound campaigns that use the email, WhatsApp, and web notification delivery modes. 
+ For more details on the interaction event values, see campaign\_event\_type under [Outbound Campaign Events](https://docs.aws.amazon.com/connect/latest/adminguide/data-lake.html#campaign-events) in the Data Lake documentation.
+ Data for this metric is available starting from November 6, 2024 0:00:00 GMT for the Email delivery mode, December 2, 2025 0:00:00 GMT for the WhatsApp delivery mode, and May 28, 2026 0:00:00 GMT for the web notification delivery mode.

## Campaign progress rate
<a name="campaign-progress-rate-hmetric"></a>

This metric measures the percentage of outbound campaign recipients attempted for delivery, out of the total number of recipients targeted. This is calculated as: (Recipients attempted / Recipients targeted) \* 100.

**Metric type**: Percent
+ Min value: 0.00%
+ Max value: 100.00%

**Metric category**: Outbound campaigns driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `CAMPAIGN_PROGRESS_RATE`
+ Dashboard: [Outbound campaigns performance dashboard](outbound-campaigns-performance-dashboard.md) 

**Notes**:
+ This metric is only available for outbound campaigns initiated using a customer segment. It is not available for event triggered campaigns.
+ Data for this metric is available starting from April 30, 2025 0:00:00 GMT.

## Campaign send attempts
<a name="campaign-send-attempts-hmetric"></a>

This metric counts the outbound campaign send requests sent by Connect Customer for delivery. A campaign send request represents a send attempt made to reach out to a recipient using the email, SMS, telephony, WhatsApp, or web notification delivery mode. 

**Metric type**: Integer

**Metric category**: Outbound campaigns driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `CAMPAIGN_SEND_ATTEMPTS`

**How to access using the Connect Customer admin website**: 
+ Dashboard: [Outbound campaigns performance dashboard](outbound-campaigns-performance-dashboard.md), Send attempts

**Notes**:
+ Data for this metric is available starting from November 6, 2024 0:00:00 GMT.

## Campaign send exclusions
<a name="campaign-send-exclusions-hmetric"></a>

This metric measures the count of outbound campaign send attempts that were excluded from the targeted segment during a campaign execution. Example exclusion reasons: MISSING\_TIMEZONE, MISSING\_CHANNEL

**Metric type**: Integer

**Metric category**: Outbound campaigns driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `CAMPAIGN_SEND_EXCLUSIONS`

**How to access using the Connect Customer admin website**: 
+ Dashboard: [Outbound campaigns performance dashboard](outbound-campaigns-performance-dashboard.md), Campaign send exclusions

**Notes**:
+ For more details on the exclusion reasons, see campaign\_event\_type under [Outbound Campaign Events](https://docs.aws.amazon.com/connect/latest/adminguide/data-lake.html#campaign-events) in the Data Lake documentation.
+ Data for this metric is available starting from April 30, 2025 0:00:00 GMT.

## Delivery attempts
<a name="delivery-attempts-hmetric"></a>

This metric measures the delivery outcome of a campaign outreach attempt. The count of outbound campaign contact outcomes from the Connect Customer dialer, or the count of outbound campaign email, SMS, WhatsApp, or web notification message outcomes that were successfully sent to Connect Customer to be delivered. 

**Metric type**: Integer

**Metric category**: Outbound campaigns driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `DELIVERY_ATTEMPTS`

**How to access using the Connect Customer admin website**: 
+ Dashboard: [Outbound campaigns performance dashboard](outbound-campaigns-performance-dashboard.md), Delivery attempts

**Notes**:
+ For details about telephony disposition definitions, see DisconnectReason for outbound campaigns and AnsweringMachineDetectionStatus in the [ContactTraceRecord](ctr-data-model.md#ctr-ContactTraceRecord).
+ For details about email, SMS, WhatsApp, and web notification disposition definitions, see campaign\_event\_type in the [Outbound campaign events](data-lake-outbound-campaigns-data.md#data-lake-oc-events) table.
+ Data for this metric is available starting from June 25, 2024 0:00:00 GMT for the Telephony delivery mode, November 6, 2024 0:00:00 GMT for the Email and SMS delivery modes, December 2, 2025 0:00:00 GMT for the WhatsApp delivery mode, and May 28, 2026 0:00:00 GMT for the web notification delivery mode.

## Delivery attempt disposition rate
<a name="delivery-attempt-disposition-rate-hmetric"></a>

This metric measures the percentage of each delivery outcome from a campaign outreach. The percent of call classification by answering machine detection or disconnect reason from outbound campaign contacts executed by the Connect Customer dialer, or the percent of outbound campaign email, SMS, WhatsApp, or web notification message outcomes that were successfully sent to Connect Customer to be delivered. 

**Metric type**: Percent
+ Min value: 0.00%
+ Max value: 100.00%

**Metric category**: Outbound campaigns driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `DELIVERY_ATTEMPT_DISPOSITION_RATE`

**Notes**:
+ Dispositions for the agent assisted voice and automated voice delivery modes are available with answering machine detection enabled. 
+ For details about telephony disposition definitions, see DisconnectReason for outbound campaigns and AnsweringMachineDetectionStatus in the [ContactTraceRecord](ctr-data-model.md#ctr-ContactTraceRecord).
+ For details about email, SMS, WhatsApp, and web notification disposition definitions, see campaign\_event\_type in the [Outbound campaign events](data-lake-outbound-campaigns-data.md#data-lake-oc-events) table.
+ Data for this metric is available starting from June 25, 2024 0:00:00 GMT for the Telephony delivery mode, November 6, 2024 0:00:00 GMT for the Email and SMS delivery modes, December 2, 2025 0:00:00 GMT for the WhatsApp delivery mode, and May 28, 2026 0:00:00 GMT for the web notification delivery mode.

## Human answered
<a name="human-answered-hmetric"></a>

This metric counts the outbound campaign calls that were connected to a live customer. This metric is available only when answering machine detection is enabled. 

**Metric type**: Integer

**Metric category**: Outbound campaigns driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `HUMAN_ANSWERED_CALLS`

**How to access using the Connect Customer admin website**: 
+ Dashboard: [Outbound campaigns performance dashboard](outbound-campaigns-performance-dashboard.md), Human answered

**Notes**:
+ This metric is available only for outbound campaigns that use the agent assisted voice and automated voice delivery modes.
+ Data for this metric is available starting from June 25, 2024 0:00:00 GMT.

## Recipients attempted
<a name="recipients-attempted-hmetric"></a>

This metric measures the approximate count of outbound campaign recipients attempted for delivery.

**Metric type**: Integer

**Metric category**: Outbound campaigns driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `RECIPIENTS_ATTEMPTED`

**How to access using the Connect Customer admin website**: 
+ Dashboard: [Outbound campaigns performance dashboard](outbound-campaigns-performance-dashboard.md), Recipients attempted

**Notes**:
+ This metric is only available for outbound campaigns initiated using a customer segment. It is not available for event triggered campaigns.
+ Data for this metric is available starting from April 30, 2025 0:00:00 GMT.

## Recipients interacted
<a name="recipients-interacted-hmetric"></a>

This metric measures the approximate count of outbound campaign recipients who interacted with the engagement after a successful delivery attempt. Example interactions include: Open, Click, Complaint

**Metric type**: Integer

**Metric category**: Outbound campaigns driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `RECIPIENTS_INTERACTED`

**How to access using the Connect Customer admin website**: 
+ Dashboard: [Outbound campaigns performance dashboard](outbound-campaigns-performance-dashboard.md) 

**Notes**:
+ This metric is only available for outbound campaigns initiated using a customer segment. It is not available for event triggered campaigns.
+ Data for this metric is available starting from April 30, 2025 0:00:00 GMT.

## Recipients targeted
<a name="recipients-targeted-hmetric"></a>

This metric measures the count of outbound campaign recipients identified as the target audience for the campaign.

**Metric type**: Integer

**Metric category**: Outbound campaigns driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `RECIPIENTS_TARGETED`

**How to access using the Connect Customer admin website**: 
+ Dashboard: [Outbound campaigns performance dashboard](outbound-campaigns-performance-dashboard.md), Recipients targeted

**Notes**:
+ This metric is only available for outbound campaigns initiated using a customer segment. It is not available for event triggered campaigns.
+ Data for this metric is available starting from April 30, 2025 0:00:00 GMT.