

# Connect Customer Cases metrics
<a name="case-management-metrics"></a>

The following case driven metrics are available on the Historical metrics reports. To access these metrics on a report, Cases needs to be [enabled](enable-cases.md) for your instance, and at least one [case template](case-templates.md) is created.

## Average case resolution time
<a name="average-case-resolution-time-metric"></a>

This metric measures the average amount of time spent to resolve a case during the provided time interval. 

**Metric type**: String (*hh:mm:ss*)

**Metric category**: Case driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `AVG_CASE_RESOLUTION_TIME`

**How to access using the Connect Customer admin website**: 
+ Historical metrics reports: Average Case Resolution Time

## Average contacts per case
<a name="average-contacts-case-metric"></a>

This metric measures the average number of contacts (calls, chat, tasks, and email) for cases created during the provided time interval.

**Metric type**: String

**Metric category**: Case driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `AVG_CASE_RELATED_CONTACTS`

**How to access using the Connect Customer admin website**: 
+ Historical metrics reports: Average Case Related Contacts

## Cases created
<a name="cases-created-metric"></a>

This metric counts all the cases created.

**Metric type**: Integer

**Metric category**: Case driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `CASES_CREATED`

**How to access using the Connect Customer admin website**: 
+ Historical metrics reports: Cases Created

**Calculation logic**:
+ Check case\_create\_time createdDataTime present?
+ Return count = 1 for each case, or null if not present.

**Notes**:
+ Uses SUM statistic for aggregation.
+ Counts each case creation event.
+ Returns null if creation timestamp is not present.
+ Can be filtered by case template and status.
+ Data for this metric is available starting from January 26, 2024 0:00:00 GMT.

## Cases reopened
<a name="cases-reopened-metric"></a>

This metric measures the number of times cases have been reopened.

**Metric type**: Integer

**Metric category**: Case driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `REOPENED_CASE_ACTIONS`

**How to access using the Connect Customer admin website**: 
+ Historical metrics reports: Reopen Case Actions Performed

**Calculation logic**:
+ Check case\_reopened\_time lastReopenedDateTime present?
+ Return count = 1 for each reopened case.

**Notes**:
+ Uses SUM statistic for aggregation.
+ Counts each reopen action.
+ Returns null if reopen timestamp is not present.
+ Can be filtered by case template and status.
+ Data for this metric is available starting from January 26, 2024 0:00:00 GMT.

## Cases resolved
<a name="cases-resolved-metric"></a>

This metric measures the number of times cases have been resolved.

**Metric type**: Integer

**Metric category**: Case driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `RESOLVED_CASE_ACTIONS`

**How to access using the Connect Customer admin website**: 
+ Historical metrics reports: Resolve Case Actions Performed

**Calculation logic**:
+ Check case\_resolved\_time lastCloseDateTime present?
+ Return count = 1 for each resolved case.

**Notes**:
+ Uses SUM statistic for aggregation.
+ Counts each resolution action.
+ Returns null if resolution timestamp is not present.
+ Can be filtered by case template and status.
+ Data for this metric is available starting from January 26, 2024 0:00:00 GMT.

## Cases resolved on first contact
<a name="cases-resolved-first-contact-metric"></a>

This metric measures the percent of cases that were resolved on the first contact (only including calls, chats, or email). Cases that have been reopened and subsequently closed in the specified interval will contribute to this metric. If cases are reopened but not closed in the specified interval it will not contribute to this metric.

**Metric type**: String
+ Min value: 0.00%
+ Max value: 100.00%

**Metric category**: Case driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `PERCENT_CASES_FIRST_CONTACT_RESOLVED`

**How to access using the Connect Customer admin website**: 
+ Historical metrics reports: Case First Contact Resolution Rate

**Calculation logic**:
+ Check if Case Status is closed?
+ Count contacts (CHAT/VOICE/EMAIL) for the case.
+ Calculate first contact resolution: Return true (1.0) if exactly one contact. Else false (0.0).

**Notes**:
+ Uses AVG statistic for final percentage.
+ Only considers closed cases.
+ Counts only CHAT, VOICE, and EMAIL contacts.
+ Returns null if case is not closed or has no contacts.
+ True (1.0) if resolved in single contact.
+ Data for this metric is available starting from December 4, 2023 0:00:00 GMT.

## Current cases
<a name="current-cases-metric"></a>

This metric counts the total cases existing in a given domain for a specific point in time.

**Metric type**: Integer

**Metric category**: Case driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `CURRENT_CASES`

**How to access using the Connect Customer admin website**: 
+ Historical metrics reports: Current cases

**Calculation logic**:
+ Get statusesNested.count for current time period.
+ Sum counts across all matching status records.

**Notes**:
+ We recommend limiting the queried time window to 5 minutes. Otherwise the returned data may be inaccurate.
+ Uses SUM statistic for aggregation.
+ Provides point-in-time case count.
+ Can be filtered by status and template.
+ Based on case snapshot timestamp.
+ Data for this metric is available starting from January 26, 2024 0:00:00 GMT.