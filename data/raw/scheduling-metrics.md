

# Schedule Adherence metrics in Connect Customer
<a name="scheduling-metrics"></a>

This section describes the metrics used when calculating Historical Schedule Adherence.

The following Scheduling metrics are available on the Real-time and Historical metrics reports. Use these metrics to track when agents are following the schedule that you have created. For instructions about how add these metrics to your report, see [How to create a historical metrics report](create-historical-metrics-report.md#historical-reports-howto-create).

These metrics are available in AWS Regions only where [Forecasting & agent scheduling](regions.md#optimization_region) is available.

## Adherence
<a name="adherence-hmetric"></a>

This metric measures the percentage of time that an agent correctly follows their schedule. 

Adherence is calculated as Adherent time divided by the sum of Adherent time and Non-adherent time. Scheduled time is not used in this calculation.

When adherence thresholds are configured, time that an agent is adherent outside their scheduled shift counts toward Adherent time. As a result, Adherent time plus Non-adherent time can be greater than Scheduled time. The Adherence percentage cannot be derived from Scheduled time.

**Metric type**: String
+ Min value: 0.00%
+ Max value: 100.00%

**Metric category**: Agent activity-driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `AGENT_SCHEDULE_ADHERENCE`

**How to access using the Connect Customer admin website**: 
+ Historical metrics reports: Adherence
+ Dashboard: [Queue and agent performance dashboard](queue-performance-dashboard.md), Adherence

**Notes**:
+ Any time you change the schedule, Schedule Adherence is re-calculated up to 30 days in the past from the current date (not the date of the schedule), if schedules are changed.

## Adherent time
<a name="adherent-time-hmetric"></a>

This metric measures the total time an agent adhered to their schedule.

**Metric type**: String

**Metric category**: Agent activity-driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `AGENT_ADHERENT_TIME`

**How to access using the Connect Customer admin website**: 
+ Historical metrics reports: Adherent time
+ Dashboard: [Queue and agent performance dashboard](queue-performance-dashboard.md), Adherent time

## Non-adherent time
<a name="non-adherent-time-hmetric"></a>

This metric measures the total time an agent did not adhere to their schedule.

**Metric type**: String (*hh:mm:ss*)

**Metric category**: Agent activity-driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `AGENT_NON_ADHERENT_TIME`

**How to access using the Connect Customer admin website**: 
+ Historical metrics reports: Non-Adherent time
+ Dashboard: [Queue and agent performance dashboard](queue-performance-dashboard.md), Non-adherent time

## Scheduled time
<a name="scheduled-time-hmetric"></a>

This metric measures the total time an agent was scheduled (either for productive or non-productive time) and *Adherence* for those shifts was set to `Yes`.

**Metric type**: String

**Metric category**: Agent activity-driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `AGENT_SCHEDULED_TIME`

**How to access using the Connect Customer admin website**: 
+ Historical metrics reports: Scheduled time
+ Dashboard: [Queue and agent performance dashboard](queue-performance-dashboard.md), Scheduled time

## Using thresholds
<a name="using-thresholds-metric"></a>

This status indicates an agent is operating within configured adherence thresholds rather than exact scheduled times.

## Threshold duration
<a name="threshold-duration-metric"></a>

The amount of time an agent has been operating within their configured threshold window.