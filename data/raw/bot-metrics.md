

# Connect Customer bot metrics and analytics
<a name="bot-metrics"></a>

The following flow driven metrics are available on the [Flows and conversational bot performance dashboard](flows-performance-dashboard.md) and the [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html).

## Average bot conversation time
<a name="average-bot-conversation-time-metric"></a>

This metric measures the average duration of completed conversations for which the invoking resource (flow or flow module) started between the specified start and end time. 

**Metric type**: String (*hh:mm:ss*)

**Metric category**: Flow driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `AVG_BOT_CONVERSATION_TIME`

   It can be filtered on specific conversation outcomes with `BOT_CONVERSATION_OUTCOME_TYPE` metric level filter.

**Calculation logic**:
+ Sum(Conversation Start Time - Conversation End Time of all filtered conversations) / (Count of all filtered conversations)

**Notes**:
+ Data for this metric is available starting from December 2, 2024 00:00:00 GMT.

## Average bot conversation turns
<a name="average-bot-conversation-turns-metric"></a>

This metric provides the average number of turns for completed conversations for which the invoking resource (flow or flow module) started between the specified start and end time. 

A single turn is a request from the client application and a response from the bot.

**Metric type**: Double

**Metric category**: Flow driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `AVG_BOT_CONVERSATION_TURNS`

   It can be filtered on specific conversation outcomes with `BOT_CONVERSATION_OUTCOME_TYPE` metric level filter.

**Calculation logic**:
+ Sum(Conversation Turn of all filtered conversations) / (Count of all filtered conversations)

**Notes**:
+ Data for this metric is available starting from December 2, 2024 00:00:00 GMT.

## Bot conversations completed
<a name="bot-conversations-completed-metric"></a>

This metric provides the count of completed conversations for which the invoking resource (flow or flow module) started between the specified start and end time. The conversation end time can be beyond the specified end time. 

For example, if you request this metric with start time at 9 AM and end time at 10 AM, the result includes conversations where the invoking resource (flow or flow module):
+ started at 9:15 AM and ended at 9:40 AM
+ started at 9:50 AM and ended at 10:10 AM

but will exclude conversations for which the invoking resource (flow or flow module):
+ started at 8:50 AM and ended at 9:10 AM

**Metric type**: Integer

**Metric category**: Flow driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `BOT_CONVERSATIONS_COMPLETED`

  It can be filtered on the following conversation outcomes using metric level filter `BOT_CONVERSATION_OUTCOME_TYPE`.
  + SUCCESS: The final intent in the conversation is categorized as *success*.
  + FAILED: The final intent in the conversation is failed. The conversation is also failed if Amazon Lex V2 defaults to the `AMAZON.FallbackIntent`.
  + DROPPED: The customer does not respond before the conversation is categorized as *success* or *failed*.

**Calculation logic**:
+ Total count of conversations.

**Notes**:
+ Data for this metric is available starting from December 2, 2024 00:00:00 GMT.

## Bot intents completed
<a name="bot-intents-completed-metric"></a>

This metric provides the count of completed intents. It includes intents for completed conversations where the invoking resource (flow or flow module) started between the specified start and end time.

**Metric type**: Integer

**Metric category**: Flow driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `BOT_INTENTS_COMPLETED`

  It can be filtered on the following conversation outcomes using metric level filter `BOT_CONVERSATION_OUTCOME_TYPE`.

  It can be filtered on the following intent outcomes using metric level filter `BOT_INTENT_OUTCOME_TYPE`.
  + SUCCESS: The bot successfully fulfilled the intent. One of the following situations is true:
    + The intent *state* is *ReadyForFulfillment* and the type of *dialogAction* is *Close*.
    + The intent `state` is `Fulfilled` and the type of `dialogAction` is `Close`.
  + FAILED: The bot failed to fulfill the intent. The intent state. One of the following situations is true:
    + The intent `state` is `Failed` and the `type` of `dialogAction` is `Close` (for example, the user declined the confirmation prompt).
    + The bot switches to the `AMAZON.FallbackIntent` before the intent is completed.
  + SWITCHED: The bot recognizes a different intent and switches to that intent instead, before the original intent is categorized as a *success* or *failed*.
  + DROPPED: The customer does not respond before the intent is categorized as *success* or *failed*.

**Calculation logic**:
+ Total count of intents.

**Notes**:
+ Data for this metric is available starting from December 2, 2024 00:00:00 GMT.

## Percent bot conversations outcome
<a name="percent-bot-conversations-outcome-metric"></a>

This metric provides the percentage of total conversations that ended in the specific outcome type specified in the metric level filter (`BOT_CONVERSATION_OUTCOME_TYPE`). It only includes completed conversations for which the invoking resource (flow or flow module) started between the specified start and end time. 

**Metric type**: Percent

**Metric category**: Flow driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `PERCENT_BOT_CONVERSATIONS_OUTCOME`

**How to access using the Connect Customer admin website**: 

**Calculation logic**:
+ (Count of conversations with BOT\_CONVERSATION\_OUTCOME\_TYPE)/(Total count of conversations) \* 100

**Notes**:
+ Data for this metric is available starting from December 2, 2024 00:00:00 GMT.

## Percent bot intents outcome
<a name="percent-bot-intents-outcome-metric"></a>

This metric provides the percentage of intents that ended in the specific outcome type specified in the metric level filter (`BOT_INTENT_OUTCOME_TYPE`). It includes intents in completed conversations where the invoking resource (flow or flow module) started between the specified start and end time.

**Metric type**: Percent

**Metric category**: Flow driven metric

**How to access using the Connect Customer API**: 
+ [GetMetricDataV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html) API metric identifier: `PERCENT_BOT_INTENTS_OUTCOME`

**How to access using the Connect Customer admin website**: 

**Calculation logic**:
+ (Count of intents with BOT\_INTENT\_OUTCOME\_TYPE)/(Total count of intents) \* 100