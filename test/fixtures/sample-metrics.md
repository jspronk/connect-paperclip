---

# Metric definitions in Connect Customer
<a name="metrics-definitions"></a>

This topic lists all metrics in alphabetical order.

## Abandonment rate
<a name="abandonment-rate"></a>

This metric measures the percentage of abandoned contacts. An abandoned contact refers to a contact that was disconnected by the customer while in queue.

The abandonment rate helps you identify potential issues with long wait times.

**Metric type**: String
+ Min value: 0.00%
+ Max value: 100.00%

**Metric category**: Contact record-driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API: `ABANDONMENT_RATE`

**How to access using the Connect Customer admin website**: 
+ Real-time metrics reports: Abandonment rate
+ Historical metrics reports: Abandonment rate

**Calculation logic**: 
+ (Contacts abandoned / Contacts queues ) \* 100.0

**Note**  
When using the **Routing Profile** grouping, the abandonment rate shows as 0.

## After contact work time
<a name="after-contact-work-time"></a>

This metric measures the total time that an agent spent doing ACW for a contact.

**Metric type**: String (*hh:mm:ss*)

**Metric category**: Contact record-driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricData](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricData.html) API metric identifier: `AFTER_CONTACT_WORK_TIME`
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `SUM_AFTER_CONTACT_WORK_TIME`

**How to access using the Connect Customer admin website**: 
+ Real-time metrics reports: Duration (when Agent Activity is in After Contact Work state)
+ Historical metrics reports: After contact work time

**Calculation logic**:
+ For each contact record
  + If Agent.AfterContactWorkDuration is present, then set result = Agent.AfterContactWorkDuration.
+ Return final\_result = sum of all the result values from matching records.

## Agent Activity
<a name="agent-activity-state-real-time"></a>

This column heading appears on Real-time metrics reports. It's not a metric exactly, but a indicator of the agent's activity state.

**Occupancy** doesn't account for concurrency, which is prose and not a section.

## Adherence
<a name="adherence"></a>

This metric measures the percentage of time that an agent correctly follows their schedule.

**Metric type**: String

**Metric category**: Agent activity-driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `AGENT_SCHEDULE_ADHERENCE`

**How to access using the Connect Customer admin website**: 
+ Historical metrics reports: Adherence
+ Dashboard: Queue and agent performance dashboard, Adherence

**Notes**:
+ Any time you change the schedule, Schedule Adherence is re-calculated.

**Related metrics**:
+ [Adherent time](#adherent-time)

## Service level X
<a name="service-level"></a>

This metric provides the percentage of contacts removed from the queue between 0 and X.

**Metric type**: String

**Metric category**: Contact record-driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `SERVICE_LEVEL`

**How to access using the Connect Customer admin website**: 
+ Real-time metrics reports: SL *X*
+ Historical metrics reports: Service level X

## Agents count
<a name="agents-count"></a>

This metric counts agents.

**Metric type**: Integer

**Metric category**: Current Agent Metric

**How to access using the Connect Customer API**: 
+ Not available

**How to access using the Connect Customer admin website**: 
+ Dashboard: [Agents count](queue-performance-dashboard.md#agent-status-drill-down)

## Evaluations performed
<a name="evaluations-performed"></a>

This metric counts evaluations.

**Metric type**: Integer

**Metric category**: Contact evaluation driven metric

**How to access using the Connect Customer admin website**: 
+ Dashboard: [Agent performance evaluations dashboard](agent-performance-evaluation-dashboard.md)
