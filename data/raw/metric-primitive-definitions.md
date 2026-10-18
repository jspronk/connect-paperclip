

# Custom metric primitives
<a name="metric-primitive-definitions"></a>

Metric primitives are used for creating custom metrics, which are personalized measurements that offer more flexibility than the standard out-of-the-box metrics. Metric primitives use metric-level filters to make them more customizable and adaptable to business needs. These metrics can be used with different statistics (such as SUM, AVG, MIN, MAX) and can be combined using arithmetic operations to devise more comprehensive measurements. The metric primitives are broadly categorized into four categories:
+ **Contact**: Helps gain insights into customer interactions and tasks.
+ **Agent**: Helps gain insights into agent performance.
+ **Flow**: Provides insights into flow executions, outcomes, and durations within your contact center workflows.
+ **Bot**: Provides insights into bot conversation performance and intent resolution within your contact center interactions.

## After contact work time
<a name="after-contact-work-time-definition"></a>

The total time that an agent spent doing After Contact Work (ACW) for a contact. In some businesses, this is also known as Call Wrap Up time.

You specify the amount of time an agent has to do ACW in their [agent’s configuration settings](https://docs.aws.amazon.com/connect/latest/adminguide/configure-agents.html). When a conversation with a contact ends, the agent is automatically allocated to do ACW for the contact. ACW ends for a contact when the agent changes to an alternate state such as available or the configured timeout is reached.

**Metric Primitive Name:** `After contact work time`

**Metric Primitive Category**: Contact

**Supported Statistics:** SUM, AVG, MIN, and MAX

## Agent Active Time
<a name="agent-active-time-definition"></a>

This metric provides the time an agent spends on a customer interaction, including Agent interaction time, Customer hold time, and After Contact Work (ACW) time. Active Time includes time spent handling contacts while in a custom status. 

Custom status = the agent's CCP status other than **Available** or **Offline**. For example, Training would be a custom status.

**Metric Primitive Name:** `Agent active time`

**Metric Primitive Category:** Contact

**Supported Statistics:** SUM, AVG, MIN, and MAX

## Agent Interaction Time
<a name="agent-interaction-time-definition"></a>

The time that agents spent interacting with a customer during a contact. This does not include After Contact Work Time, Customer Hold Time, Custom status time, or agent pause duration (which applies only to tasks).

**Metric Primitive Name:** `Agent interaction time`

**Metric Primitive Category: **Contact

**Supported Statistics:** SUM, AVG, MIN, and MAX

## Contact Hold Time
<a name="contact-hold-time-definition"></a>

This metric measures the total time that customers spent on hold after being connected to an agent. This includes time spent on a hold when being transferred, but does not include time spent in a queue.

**Metric Primitive Name:** `Contact hold time`

**Metric Primitive Category: ** Contact

**Supported Statistics: **SUM, AVG, MIN, and MAX

## Agent Pause Time
<a name="agent-pause-time-definition"></a>

This metric measures the total time an agent kept a task in a paused state after the task was connected to them. It applies only to `TASK` channel contacts, including both inbound and outbound tasks.

**Metric Primitive Name:** `Agent pause time`

**Metric Primitive Category: **Contact

**Supported Statistics:** SUM, AVG, MIN, and MAX

## Contact Duration
<a name="contact-duration-definition"></a>

This metric measures the time a contact spends from the contact initiation timestamp to disconnect timestamp.

**Metric Primitive Name:** `Contact duration`

**Metric Primitive Category:** Contact

**Supported Statistics:** SUM, AVG, MIN, and MAX

## Contact Queue Time
<a name="contact-queue-time-definition"></a>

The total time that a contact waited in a queue before being answered by an agent. Also known as queue wait time.

**Metric Primitive Name:** `Contact queue time`

**Metric Primitive Category:** Contact

**Supported Statistics:** SUM, AVG, MIN, and MAX

## Contacts Abandoned
<a name="contacts-abandoned-definition"></a>

This metric counts the number of contacts that were disconnected by the customer while waiting in the queue. Inbound contacts which disconnect because they requested a callback are not counted as abandoned.

**Metric Primitive Name:** `Contacts abandoned`

**Metric Primitive Category:** Contact

**Supported Statistics:** SUM

## Contacts Created
<a name="contacts-created-definition"></a>

The number of contacts created during the specified time range. This includes all inbound and outbound contacts regardless of how they were initiated.

**Metric Primitive Name:** `Contacts created`

**Metric Primitive Category: **Contact

**Supported Statistics:** SUM

## Contacts Handled
<a name="contacts-handled-definition"></a>

This metric counts the contacts that were connected to an agent during a given time period. It doesn't matter how the contact got to the agent.

**Metric Primitive Name:** `Contacts handled`

**Metric Primitive Category: **Contact

**Supported Statistics:** SUM

## Contacts Hold Abandons
<a name="contacts-hold-abandons-definition"></a>

This metric counts the contacts that disconnected while the customer was on hold. This includes both contacts disconnected by the agent and contacts disconnected by the customer.

**Metric Primitive Name:** `Contacts hold disconnect`

**Metric Primitive Category: **Contact

**Supported Statistics: **SUM

## Contacts Put On Hold
<a name="contacts-put-on-hold-definition"></a>

The number of contacts put on hold by an agent at least once. If a contact is put on hold multiple times, it is counted only once.

**Metric Primitive Name:** `Contacts put on hold`

**Metric Primitive Category:** Contact

**Supported Statistics:** SUM

## Contacts Queued
<a name="contacts-queued-definition"></a>

The number of contacts added to a queue during the specified time range. This includes contacts whether they were handled, abandoned, or are still in the queue.

**Metric Primitive Name:** `Contacts queued`

**Metric Primitive Category: **Contact

**Supported Statistics: **SUM

## Contacts Transferred Out
<a name="contacts-transferred-out-definition"></a>

The number of contacts transferred out from queue to queue, and transferred out by an agent using the CCP. 

**Metric Primitive Name:** `Contacts transferred out`

**Metric Primitive Category: **Contact

**Supported Statistics: **SUM

## Contact Handle Time
<a name="contact-handle-time-definition"></a>

This metric measures the total time, from start to finish, that a contact is connected with an agent (handle time). It includes talk time, customerHoldDuration, after contact work (ACW) time, and agent pause duration (which applies only to tasks). It applies to both inbound and outbound contacts. 

**Metric Primitive Name:** `Contact handle time`

**Metric Primitive Category: **Contact

**Supported Statistics: **SUM

## Contact Holds
<a name="contact-holds-definition"></a>

The number of times voice contacts were put on hold while interacting with an agent. Provides insights into how often agents need to put customers on hold during interactions.

**Metric Primitive Name:** `Contact holds`

**Metric Primitive Category: **Contact

**Supported Statistics:** SUM, AVG, MIN, and MAX

## Contact Resolution Time
<a name="contact-resolution-time-definition"></a>

The total time from when a contact enters the system until it is resolved. This includes queue time, interaction time, hold time, and after contact work time.

**Metric Primitive Name:** `Contact resolution time`

**Metric Primitive Category:** Contact

**Supported Statistics: **SUM, AVG, MIN, and MAX

## Contact Flow Duration
<a name="contact-flow-duration-definition"></a>

This metric measures the total time a contact spent in a flow. It's the IVR time, the time from the start until contact is queued, transferred, or disconnected—whichever occurred first. Outbound contacts don't start in a flow, so outbound contacts aren't included. 

**Metric Primitive Name:** `Contact flow duration`

**Metric Primitive Category:** Contact

**Supported Statistics: **SUM, AVG, MIN, and MAX

## Agent Greeting Time
<a name="agent-greeting-time-definition"></a>

The first response time of agents on chat, indicating how quickly they engage with customers after joining the chat.

**Note**  
This metric is available only for contacts analyzed by conversational analytics. For more information, see the following metric: [Average agent greeting time](https://docs.aws.amazon.com/connect/latest/adminguide/contact-lens-metrics.html#average-greeting-time-agent-hmetric)

**Metric Primitive Name:** `Agent greeting time`

**Metric Primitive Category:** Contact

**Supported Statistics:** SUM, AVG, MIN, and MAX

## Agent Interruption Time
<a name="agent-interruption-time-definition"></a>

The total agent interruption time while talking to a contact. 

**Note**  
This metric is available only for contacts analyzed by conversational analytics. For more information, see the following metric: [Average agent interruptions time](https://docs.aws.amazon.com/connect/latest/adminguide/contact-lens-metrics.html#average-interruption-time-agent-hmetric)

**Metric Primitive Name:** `Agent interruption time`

**Metric Primitive Category:** Contact

**Supported Statistics: **SUM, AVG, MIN, and MAX

## Agent Interruptions
<a name="agent-interruptions-definition"></a>

Quantifies the frequency of agent interruptions during customer interactions.

**Note**  
This metric is available only for contacts analyzed by conversational analytics. For more information, see the following metric: [Average agent interruptions](https://docs.aws.amazon.com/connect/latest/adminguide/contact-lens-metrics.html#average-interruptions-agent-hmetric)

**Metric Primitive Name:** `Agent interruptions`

**Metric Primitive Category:** Contact

**Supported Statistics: **SUM, AVG, MIN, and MAX

## Talk Time Agent
<a name="talk-time-agent-definition"></a>

The time that was spent talking in a conversation by an agent. 

**Note**  
This metric is available only for contacts analyzed by conversational analytics. For more information, see the following metric: [Average agent talk time](https://docs.aws.amazon.com/connect/latest/adminguide/contact-lens-metrics.html#average-talk-time-agent-hmetric)

**Metric Primitive Name: ** `Agent talk time`

**Metric Primitive Category: ** Contact

**Supported Statistics: **SUM, AVG, MIN, and MAX

## Talk Time Customer
<a name="talk-time-customer-definition"></a>

The time that was spent talking in a conversation by a customer. 

**Note**  
This metric is available only for contacts analyzed by conversational analytics. For more information, see the following metric: [Average customer talk time](https://docs.aws.amazon.com/connect/latest/adminguide/contact-lens-metrics.html#average-talk-time-customer-hmetric)

Note:

**Metric Primitive Name:** `Customer talk time`

**Metric Primitive Category: ** Contact

**Supported Statistics: **SUM, AVG, MIN, and MAX

## Non-Talk Time
<a name="non-talk-time-definition"></a>

This metric provides the total non-talk time in a voice conversation. Non-talk time refers to the combined duration of hold time and periods of silence exceeding 3 seconds, during which neither the agent nor the customer is engaged in conversation.

**Note**  
This metric is available only for contacts analyzed by conversational analytics. For more information, see the following metric: [Average non-talk time](https://docs.aws.amazon.com/connect/latest/adminguide/contact-lens-metrics.html#average-non-talk-time-hmetric)

**Metric Primitive Name:** `Non-talk time`

**Metric Primitive Category:** Contact

**Supported Statistics:** SUM, AVG, MIN, and MAX

## Talk Time
<a name="talk-time-definition"></a>

The time that was spent talking during a voice contact across either the customer or the agent. 

**Note**  
This metric is available only for contacts analyzed by conversational analytics. For more information, see the following metric: [Average talk time](https://docs.aws.amazon.com/connect/latest/adminguide/contact-lens-metrics.html#average-talk-time-hmetric)

**Metric Primitive Name:** `Talk time`

**Metric Primitive Category:** Contact

**Supported Statistics:** SUM, AVG, MIN, and MAX

## Conversation Duration
<a name="conversation-duration-definition"></a>

The conversation duration of voice contacts with agents. Calculated by the total time from the start of the conversation until the last word spoken by either the agent or the customer.

**Note**  
This metric is available only for contacts analyzed by conversational analytics. For more information, see the following metric: [Average conversation duration](https://docs.aws.amazon.com/connect/latest/adminguide/contact-lens-metrics.html#average-conversation-duration-hmetric)

**Metric Primitive Name:** `Conversation duration`

**Metric Primitive Category:**Contact

**Supported Statistics:** SUM, AVG, MIN, and MAX

## Contacts Routed
<a name="contacts-routed-definition"></a>

This metric counts the number of contacts routed to an agent.

**Metric Primitive Name:** `Contacts routed`

**Metric Primitive Category:** Agent

**Supported Statistics:** SUM

## Agent Contacts Missed
<a name="agent-contacts-missed-definition"></a>

This metric counts the contacts routed to an agent but not answered by that agent, including contacts abandoned by the customer.

If a contact is not answered by a given agent, Amazon Connect attempts to route it to another agent to handle. The contact is not dropped. Because a single contact can be missed multiple times (including by the same agent), it can be counted multiple times: once for each time it is routed to an agent but not answered.

**Metric Primitive Name:** `Agent contacts missed`

**Metric Primitive Category:** Agent

**Supported Statistics:** SUM

## Agent Idle Time
<a name="agent-idle-time-definition"></a>

This metric measures the amount of time agent wasn’t handling contacts \+ any time their contacts were in an Error state, after the agent sets their status in the CCP to Available. 

Agent idle time includes the amount of time from when Amazon Connect starts routing the contact to the agent to when the agent picks up or declines the contact. After an agent accepts the contact, the agent is no longer considered idle. This metric can't be grouped or filtered by queue, phone number, or channels.

**Metric Primitive Name:** `Agent idle time`

**Metric Primitive Category:** Agent

**Supported Statistics:** SUM

## Agent Contact Time
<a name="agent-on-contact-time-definition"></a>

This is a measure of the total time that an agent spent on a contact, including Customer Hold Time and After Contact Work Time. This does not include time spent on a contact while in a custom status or Offline status. (Custom status = the agent's CCP status is other than Available or Offline. For example, Training would be a custom status.) 

This metric can't be grouped or filtered by queue, phone number, or channels.

**Metric Primitive Name:** `Agent on contact time`

**Metric Primitive Category:** Agent

**Supported Statistics:** SUM

## Agent Online Time
<a name="agent-online-time-definition"></a>

This is a measures the total time that an agent spent with their CCP set to a status other than **Offline**. This includes any time spent in a custom status. This metric can't be grouped or filtered by queue, phone number, or channels.

**Metric Primitive Name:** `Agent online time`

**Metric Primitive Category:** Agent

**Supported Statistics:** SUM

## Agent Error Status Time
<a name="agent-error-status-time-definition"></a>

This is the measure of the total time contacts were in an error status. This metric can't be grouped or filtered by queue, phone number, or channels.

**Metric Primitive Name:** `Agent error status time`

**Metric Primitive Category:** Agent

**Supported Statistics:** SUM

## Agent Non-Productive Time
<a name="agent-non-productive-time-definition"></a>

This measures the total time that agents spent in a custom status. That is, their CCP status is other than **Available** or **Offline**. This metric doesn't mean that the agent was spending their time unproductively. This metric can't be grouped or filtered by queue, phone number, or channels.

**Metric Primitive Name:** `Agent online time - non-productive`

**Metric Primitive Category:** Agent

**Supported Statistics:** SUM

## Agent Connecting Time
<a name="agent-connecting-time-definition"></a>

The total time between when a contact is initiated by Amazon Connect reserving the agent for the contact, and the agent is connected (in ms).

**Metric Primitive Name:** `Agent connecting time`

**Metric Primitive Category:** Agent

**Supported Statistics:** SUM

## Current Contacts In Queue
<a name="current-contacts-in-queue-definition"></a>

This metric counts the contacts currently in the queue. This metric helps organizations monitor queue load and make staffing decisions.

**Metric Primitive Name:** `Contacts in queue`

**Metric Primitive Category:** Current Contact

**Supported Statistics:** SUM

## Current Contact Queue Time
<a name="current-contacts-queue-time-definition"></a>

The metric helps measures the length of time in the queue for the contact that has been in the queue the longest.

**Metric Primitive Name:** `Contact queue time`

**Metric Primitive Category:** Current Contact

**Supported Statistics:** MAX

## Current Contacts Scheduled
<a name="current-contacts-scheduled-definition"></a>

This metric counts the number of scheduled callbacks, which will enter a queue in a future time. For more information please refer to the: 
+ [Set up queued callback by creating flows, queues, and routing profiles](https://docs.aws.amazon.com/connect/latest/adminguide/setup-queued-cb.html) in Amazon Connect Administrator Guide
+ [How Initial delay affects Scheduled and In queue metrics](https://docs.aws.amazon.com/connect/latest/adminguide/scheduled-vs-inqueue.html) in Amazon Connect Administrator Guide

**Metric Primitive Name:** `Contacts Scheduled`

**Metric Primitive Category:** Current Contact

**Supported Statistics:** SUM

## Current Slots Available
<a name="slots-available-definition"></a>

This metric measures how many more contact can be handled by agents. See also [agent concurrency](https://docs.aws.amazon.com/connect/latest/adminguide/channels-and-concurrency.html).

**Metric Primitive Name:** `Contact availability`

**Metric Primitive Category:** Current Agent

**Supported Statistics:** SUM

## Current Slots Active
<a name="slots-active-definition"></a>

This metric measures the total number of contacts being handled by agents. See also [agent concurrency](https://docs.aws.amazon.com/connect/latest/adminguide/channels-and-concurrency.html).

**Metric Primitive Name:** `Contacts active`

**Metric Primitive Category:** Current Agent

**Supported Statistics:** SUM

## Current Agents Online
<a name="agents-online-definition"></a>

This metric counts the number of agents who are currently online in the contact center. An agent is considered online when their status in the CCP is set to any status other than Offline.

**Metric Primitive Name:** `Agents online`

**Metric Primitive Category:** Current Agent

**Supported Statistics:** SUM

## Flows Started
<a name="flows-started-definition"></a>

The count of flows that started running within the specified start time and end time. For a given start and end time, this metric shows the count of those flows where the start time is between the start and end interval specified.

**Metric Primitive Name:** `Flows started`

**Metric Primitive Category:** Flow

**Supported Statistics:** SUM

## Flows Completed
<a name="flows-completed-definition"></a>

The count of flows that started execution within the specified start time and end time and ended with a specified flow outcome. You can filter this metric by specific flow outcomes.

For a given start and end time, this metric shows the count of those flows whose start time falls within the specified interval and that have an end time. The end time of the flow can be greater than the end time specified in the query interval. The metric does not show the count of flows that started before the start time and that are in progress during the specified interval. The outcomes are terminal blocks in a flow.

**Metric Primitive Name:** `Flows completed`

**Metric Primitive Category:** Flow

**Supported Statistics:** SUM

## Flow Duration
<a name="flow-duration-definition"></a>

The duration (in milliseconds) of flows that started execution within the specified start time and end time and that have an end time.

**Metric Primitive Name:** `Flow duration`

**Metric Primitive Category:** Flow

**Supported Statistics:** SUM, AVG, MIN, and MAX

## Bot Conversations Completed
<a name="bot-conversations-completed-definition"></a>

The count of completed conversations for which the invoking resource (flow or flow module) started between the specified start and end time. The conversation end time can be beyond the specified end time.

**Metric Primitive Name:** `Bot conversations completed`

**Metric Primitive Category:** Bot

**Supported Statistics:** SUM

## Bot Intents Completed
<a name="bot-intents-completed-definition"></a>

The count of completed intents. It includes intents for completed conversations where the invoking resource (flow or flow module) started between the specified start and end time.

**Metric Primitive Name:** `Bot intents completed`

**Metric Primitive Category:** Bot

**Supported Statistics:** SUM

## Bot Conversation Duration
<a name="bot-conversation-duration-definition"></a>

The duration (in milliseconds) of completed conversations for which the invoking resource (flow or flow module) started between the specified start and end time. The conversation end time can be beyond the specified end time.

**Metric Primitive Name:** `Bot conversation duration`

**Metric Primitive Category:** Bot

**Supported Statistics:** SUM, AVG, MIN, and MAX

## Bot Conversation Turns
<a name="bot-conversation-turns-definition"></a>

The turns in completed conversations for which the invoking resource (flow or flow module) started between the specified start and end time. The conversation end time can be beyond the specified end time. A single turn is a request from the client application and a response from the bot.

**Metric Primitive Name:** `Bot conversation turns`

**Metric Primitive Category:** Bot

**Supported Statistics:** SUM, AVG, MIN, and MAX

## Metric level filters supported per metric primitive category
<a name="supported-metric-filters"></a>





- ** Contact **
  - **Metric Level Filter Key:** Initiation method / **Metric Level Filter Key Description:** Indicates how the contact was initiated. / **Metric Level Filter Values:** Example: INBOUND, OUTBOUND, TRANSFER, QUEUE\_TRANSFER, CALLBACK, API.<br />For more filter values, see the InitiationMethod section of ContactTraceRecord in the Amazon Connect Administrator Guide.
  - **Metric Level Filter Key:** Disconnect reason / **Metric Level Filter Key Description:** Indicates how the contact was terminated. / **Metric Level Filter Values:** A few examples of filter values are AGENT\_DISCONNECT, CUSTOMER\_DISCONNECT, TRANSFER, THIRD\_PARTY\_DISCONNECT, BARGED, CONTACT\_FLOW\_DISCONNECT.<br />For more filter values, see ContactTraceRecord in the Amazon Connect Administrator Guide.
  - **Metric Level Filter Key:** Channel / **Metric Level Filter Key Description:** How the contact reached your contact center. / **Metric Level Filter Values:** Valid values: Voice, Chat, Task, Email
  - **Metric Level Filter Key:** ValidationTestType (Represented as **Contact source** in the custom metric builder) / **Metric Level Filter Key Description:** Represents the testing and simulation type. This field remains empty for non-simulated contacts. You can use this attribute in the analytics dashboard to filter out actual customer contacts or to identify whether a contact is simulated within your contact record object. / **Metric Level Filter Values:** For valid values, see the **connect:ValidationTestType** table row in the [SegmentAttributes](https://docs.aws.amazon.com/connect/latest/adminguide/connect-attrib-list.html#attribs-segment-attributes) section. 
  - **Metric Level Filter Key:** Subtype / **Metric Level Filter Key Description:** Represents the subtype of the channel used for the contact. / **Metric Level Filter Values:** For valid values, see the **connect:Subtype** table row in the [SegmentAttributes](https://docs.aws.amazon.com/connect/latest/adminguide/connect-attrib-list.html#attribs-segment-attributes) section. 
  - **Metric Level Filter Key:** User defined attribute keys / **Metric Level Filter Key Description:** Represents any user defined predefined attribute that has been enabled for analytics. / **Metric Level Filter Values:** Navigate to the [predefined attributes page](https://docs.aws.amazon.com/connect/latest/adminguide/predefined-attributes.html) for the user defined attribute to understand what values are available. 
  - **Metric Level Filter Key:** Feature / **Metric Level Filter Key Description:** Identifies if conversational analytics is enabled on the flow. / **Metric Level Filter Values:** Contacts analyzed by conversational analytics
  - **Metric Level Filter Key:** Is abandoned / **Metric Level Filter Key Description:** This is true when the contact was abandoned by customer while waiting in queue, false otherwise.<br />Please note if a contact was scheduled for a callback it would not be considered as abandoned. / **Metric Level Filter Values:** True or False
  - **Metric Level Filter Key:** Is resulted in callback / **Metric Level Filter Key Description:** This is true when the contact was scheduled for a callback, false otherwise.
  - **Metric Level Filter Key:** Is handled / **Metric Level Filter Key Description:** This is true when a contact is connected to an agent, false otherwise.
  - **Metric Level Filter Key:** Is put on hold / **Metric Level Filter Key Description:** This is true when a contact is put on hold by an agent, false otherwise.
  - **Metric Level Filter Key:** Is queued / **Metric Level Filter Key Description:** This is true when a contact gets queued, false otherwise.
  - **Metric Level Filter Key:** Is transferred out / **Metric Level Filter Key Description:** This is true when the contact is transferred out from a queue to another queue, or transferred out by an agent, false otherwise.
  - **Metric Level Filter Key:** After contact work time (ms) / **Metric Level Filter Key Description:** Measures the total time that an agent spent doing ACW for a contact. / **Metric Level Filter Values:** Numeric input denoting time in milliseconds
  - **Metric Level Filter Key:** Agent active time (ms) / **Metric Level Filter Key Description:** Measures the time an agent spends on a customer interaction, including Agent interaction time, Customer hold time, and After contact work (ACW) time.
  - **Metric Level Filter Key:** Agent interaction time (ms) / **Metric Level Filter Key Description:** Measures the time that agents interacted with customers during inbound and outbound contacts.
  - **Metric Level Filter Key:** Agent pause time (ms) / **Metric Level Filter Key Description:** Measures the time that an agent paused a contact after the contact was connected to the agent.
  - **Metric Level Filter Key:** Contact duration (ms) / **Metric Level Filter Key Description:** Measures the time a contact spends from the contact initiation timestamp to disconnect timestamp
  - **Metric Level Filter Key:** Contact flow duration (ms) / **Metric Level Filter Key Description:** Measures the total time a contact spent in a flow. It's the IVR time, the time from the start until contact is queued.
  - **Metric Level Filter Key:** Contact handle time (ms) / **Metric Level Filter Key Description:** Measures total time that an agent spent on contacts, including Customer Hold Time and After contact work time. This includes any time spent on contacts while in a custom status.
  - **Metric Level Filter Key:** Contact hold time (ms) / **Metric Level Filter Key Description:** Measures the total time that customers spent on hold after being connected to an agent.
  - **Metric Level Filter Key:** Queue time (ms) / **Metric Level Filter Key Description:** Measures the average time that contacts waited in the queue before being answered by an agent.
  - **Metric Level Filter Key:** Contact resolution time (ms) / **Metric Level Filter Key Description:** Measures the average time, beginning from the time a contact was initiated to the time it resolved. The resolution time for a contact is defined as: beginning from InitiationTimestamp, and ending at AfterContactWorkEndTimestamp or DisconnectTimestamp, whichever one is later.
  - **Metric Level Filter Key:** Agent greeting time (ms) / **Metric Level Filter Key Description:** Measures the first response time of agents on chat, indicating how quickly they engage with customers after joining the chat.
  - **Metric Level Filter Key:** Agent interruption time (ms) / **Metric Level Filter Key Description:** Measures the of total agent interruption time while talking to a contact.
  - **Metric Level Filter Key:** Talk time customer (ms) / **Metric Level Filter Key Description:** Measures the time that was spent talking in a conversation by a customer.
  - **Metric Level Filter Key:** Non talk time (ms) / **Metric Level Filter Key Description:** Measures the of total non-talk time in a voice conversation. Non-talk time refers to the combined duration of hold time and periods of silence exceeding 3 seconds, during which neither the agent nor the customer is engaged in conversation.
  - **Metric Level Filter Key:** Conversation duration (ms) / **Metric Level Filter Key Description:** Measures the total conversation duration.
  - **Metric Level Filter Key:** Talk time (ms) / **Metric Level Filter Key Description:** Measures the time that was spent talking during a voice contact across either the customer or the agent.
  - **Metric Level Filter Key:** Talk time agent (ms) / **Metric Level Filter Key Description:** Measures the time that was spent talking in a conversation by an agent.
  - **Metric Level Filter Key:** Agent interruptions / **Metric Level Filter Key Description:** Quantifies the frequency of agent interruptions during customer interactions. / **Metric Level Filter Values:** Numeric input denoting count
  - **Metric Level Filter Key:** Contact holds / **Metric Level Filter Key Description:** Measures the average number of times voice contacts were put on hold while interacting with an agent.

- ** Agent **
  - **Metric Level Filter Key:** Channel / **Metric Level Filter Key Description:** How the contact reached your contact center. / **Metric Level Filter Values:** Valid values: Voice, Chat, Task, Email
  - **Metric Level Filter Key:** Initiation Method / **Metric Level Filter Key Description:** Indicates how the contact was initiated. (Only supported for Agent Connecting Time) / **Metric Level Filter Values:** Example: INBOUND, OUTBOUND, TRANSFER, QUEUE\_TRANSFER, CALLBACK, API.<br />For more filter values, see the InitiationMethod section of [ContactTraceRecord](https://docs.aws.amazon.com/connect/latest/adminguide/ctr-data-model.html#ctr-ContactTraceRecord) in the Connect Customer Administrator Guide.

- ** Current Contact **
  - **Metric Level Filter Key:** Channel / **Metric Level Filter Key Description:** How the contact reached your contact center. / **Metric Level Filter Values:** Valid values: Voice, Chat, Task, Email
  - **Metric Level Filter Key:** Initiation Method / **Metric Level Filter Key Description:** Indicates how the contact was initiated. / **Metric Level Filter Values:** Example: Inbound, Outbound, Transfer, Queue transfer, Callback, API.<br />For more filter values, see the InitiationMethod section of [ContactTraceRecord](https://docs.aws.amazon.com/connect/latest/adminguide/ctr-data-model.html#ctr-ContactTraceRecord) in the Amazon Connect Administrator Guide.
  - **Metric Level Filter Key:** ValidationTestType (Represented as **Contact Source** in the custom metric builder) / **Metric Level Filter Key Description:** Represents the testing and simulation type. This field remains empty for non-simulated contacts. You can use this attribute in the analytics dashboard to filter out actual customer contacts or to identify whether a contact is simulated within your contact record object. / **Metric Level Filter Values:** For valid values, see the **connect:ValidationTestType** table row in the [SegmentAttributes](https://docs.aws.amazon.com/connect/latest/adminguide/connect-attrib-list.html#attribs-segment-attributes) section. 
  - **Metric Level Filter Key:** Subtype / **Metric Level Filter Key Description:** Represents the subtype of the channel used for the contact. / **Metric Level Filter Values:** For valid values, see the **connect:Subtype** table row in the [SegmentAttributes](https://docs.aws.amazon.com/connect/latest/adminguide/connect-attrib-list.html#attribs-segment-attributes) section. 
  - **Metric Level Filter Key:** User defined attribute keys / **Metric Level Filter Key Description:** Represents any user defined predefined attribute that has been enabled for analytics. / **Metric Level Filter Values:** Navigate to the [predefined attributes page](https://docs.aws.amazon.com/connect/latest/adminguide/predefined-attributes.html) for the user defined attribute to understand what values are available. 

- ** Current Agent **
  - **Metric Level Filter Key:** Channel / **Metric Level Filter Key Description:** How the contact reached your contact center. / **Metric Level Filter Values:** Valid values: Voice, Chat, Task, Email
  - **Metric Level Filter Key:** Initiation Method / **Metric Level Filter Key Description:** Indicates how the contact was initiated. (Only supported for Contacts active) / **Metric Level Filter Values:** Example: Inbound, Outbound, Transfer, Callback, Api, Webrtc Api, Queue Transfer, Monitor, Disconnect, External Outbound, Agent Reply, Flow, Campaign Preview.<br />For a list of allowed values, see [Contact object](https://docs.aws.amazon.com/connect/latest/adminguide/agent-event-stream-model.html#Contact).
  - **Metric Level Filter Key:** contactStatus (Represented as Agent Contact State in the custom metric builder) / **Metric Level Filter Key Description:** Contact states are events that appear in the lifecycle of a contact. You can locate them in two places: the real-time metrics reports and the agent event stream. (Only supported for Agents online) / **Metric Level Filter Values:** Example: Incoming, Pending, Connected.<br />For more filter values, see [Contact states in the agent event stream](https://docs.aws.amazon.com/connect/latest/adminguide/about-contact-states.html) in the Amazon Connect Administrator Guide.

- ** Flow **
  - **Metric Level Filter Key:** Flow outcome / **Metric Level Filter Key Description:** Indicates the terminal outcome of the flow execution. / **Metric Level Filter Values:** Example: ENDED\_FLOW\_EXECUTION, DISCONNECTED\_PARTICIPANT, DROPPED, and so on. For more filter values, see the InitiationMethod section of [ContactTraceRecord](https://docs.aws.amazon.com/connect/latest/adminguide/ctr-data-model.html#ctr-ContactTraceRecord) in the Amazon Connect Administrator Guide.
  - **Metric Level Filter Key:** Flow resource type / **Metric Level Filter Key Description:** Indicates the type of flow resource (Flow or Module). / **Metric Level Filter Values:** Flow, Module
  - **Metric Level Filter Key:** Initiation method / **Metric Level Filter Key Description:** Indicates how the contact was initiated. / **Metric Level Filter Values:** Example: INBOUND, OUTBOUND, TRANSFER, QUEUE\_TRANSFER, CALLBACK, API, and so on. For more filter values, see the InitiationMethod section of [ContactTraceRecord](https://docs.aws.amazon.com/connect/latest/adminguide/ctr-data-model.html#ctr-ContactTraceRecord) in the Amazon Connect Administrator Guide.
  - **Metric Level Filter Key:** Next resource type / **Metric Level Filter Key Description:** Indicates the type of the next resource the flow transitioned to. / **Metric Level Filter Values:** Queue, Flow, Agent
  - **Metric Level Filter Key:** Channel / **Metric Level Filter Key Description:** How the contact reached your contact center. / **Metric Level Filter Values:** Valid values: Voice, Chat, Task, Email

- ** Bot **
  - **Metric Level Filter Key:** Bot conversation outcome type / **Metric Level Filter Key Description:** Indicates the outcome type of the bot conversation. / **Metric Level Filter Values:** Success, Failed, Dropped
  - **Metric Level Filter Key:** Bot intent outcome type / **Metric Level Filter Key Description:** Indicates the outcome type of the bot intent. / **Metric Level Filter Values:** Success, Failed, Dropped, Switched
  - **Metric Level Filter Key:** Initiation method / **Metric Level Filter Key Description:** Indicates how the contact was initiated. / **Metric Level Filter Values:** For the full list of valid values, see the InitiationMethod section of [ContactTraceRecord](https://docs.aws.amazon.com/connect/latest/adminguide/ctr-data-model.html#ctr-ContactTraceRecord) in the Amazon Connect Administrator Guide.
  - **Metric Level Filter Key:** Invoking resource type / **Metric Level Filter Key Description:** Indicates the type of resource that invoked the bot. / **Metric Level Filter Values:** Flow, Module
  - **Metric Level Filter Key:** Channel / **Metric Level Filter Key Description:** How the contact reached your contact center. / **Metric Level Filter Values:** Valid values: Voice, Chat, Task, Email



## Groupings supported per metric primitive category
<a name="supported-metric-groupings"></a>





- ** Contact **
  - **Grouping Key:** AGENT / **Grouping Dashboard Display Name:** Agent
  - **Grouping Key:** AGENT\_HIERARCHY\_LEVEL\_FIVE / **Grouping Dashboard Display Name:** Agent hierarchy level five
  - **Grouping Key:** AGENT\_HIERARCHY\_LEVEL\_FOUR / **Grouping Dashboard Display Name:** Agent hierarchy level four
  - **Grouping Key:** AGENT\_HIERARCHY\_LEVEL\_THREE / **Grouping Dashboard Display Name:** Agent hierarchy level three
  - **Grouping Key:** AGENT\_HIERARCHY\_LEVEL\_TWO / **Grouping Dashboard Display Name:** Agent hierarchy level two
  - **Grouping Key:** AGENT\_HIERARCHY\_LEVEL\_ONE / **Grouping Dashboard Display Name:** Agent hierarchy level one
  - **Grouping Key:** CHANNEL / **Grouping Dashboard Display Name:** Channel
  - **Grouping Key:** QUEUE / **Grouping Dashboard Display Name:** Queue
  - **Grouping Key:** Q\_CONNECT\_ENABLED / **Grouping Dashboard Display Name:** Amazon Q
  - **Grouping Key:** ROUTING\_PROFILE / **Grouping Dashboard Display Name:** Routing profile
  - **Grouping Key:** contact/segmentAttributes/connect:Subtype / **Grouping Dashboard Display Name:** Subtype
  - **Grouping Key:** contact/segmentAttributes/connect:ValidationTestType / **Grouping Dashboard Display Name:** Contact source

- ** Agent **
  - **Grouping Key:** AGENT / **Grouping Dashboard Display Name:** Agent
  - **Grouping Key:** AGENT\_HIERARCHY\_LEVEL\_FIVE / **Grouping Dashboard Display Name:** Agent hierarchy level five
  - **Grouping Key:** AGENT\_HIERARCHY\_LEVEL\_FOUR / **Grouping Dashboard Display Name:** Agent hierarchy level four
  - **Grouping Key:** AGENT\_HIERARCHY\_LEVEL\_THREE / **Grouping Dashboard Display Name:** Agent hierarchy level three
  - **Grouping Key:** AGENT\_HIERARCHY\_LEVEL\_TWO / **Grouping Dashboard Display Name:** Agent hierarchy level two
  - **Grouping Key:** AGENT\_HIERARCHY\_LEVEL\_ONE / **Grouping Dashboard Display Name:** Agent hierarchy level one
  - **Grouping Key:** CHANNEL / **Grouping Dashboard Display Name:** Channel
  - **Grouping Key:** QUEUE / **Grouping Dashboard Display Name:** Queue
  - **Grouping Key:** ROUTING\_PROFILE / **Grouping Dashboard Display Name:** Routing profile

- ** Current Contact **
  - **Grouping Key:** CHANNEL / **Grouping Dashboard Display Name:** Channel
  - **Grouping Key:** QUEUE / **Grouping Dashboard Display Name:** Queue
  - **Grouping Key:** ROUTING\_PROFILE / **Grouping Dashboard Display Name:** Routing profile
  - **Grouping Key:** SUBTYPE / **Grouping Dashboard Display Name:** Subtype
  - **Grouping Key:** VALIDATION\_TEST\_TYPE / **Grouping Dashboard Display Name:** ValidationTestType

- ** Current Agent **
  - **Grouping Key:** CHANNEL / **Grouping Dashboard Display Name:** Channel
  - **Grouping Key:** QUEUE / **Grouping Dashboard Display Name:** Queue
  - **Grouping Key:** ROUTING\_PROFILE / **Grouping Dashboard Display Name:** Routing profile

- ** Flow **
  - **Grouping Key:** CHANNEL / **Grouping Dashboard Display Name:** Channel
  - **Grouping Key:** FLOWS\_RESOURCE\_ID / **Grouping Dashboard Display Name:** Flow
  - **Grouping Key:** FLOWS\_MODULE\_RESOURCE\_ID / **Grouping Dashboard Display Name:** Flow module
  - **Grouping Key:** INITIATION\_METHOD / **Grouping Dashboard Display Name:** Initiation method
  - **Grouping Key:** FLOWS\_RESOURCE\_TYPE / **Grouping Dashboard Display Name:** Only available through API
  - **Grouping Key:** RESOURCE\_PUBLISHED\_TIMESTAMP / **Grouping Dashboard Display Name:** Only available through API
  - **Grouping Key:** FLOWS\_NEXT\_RESOURCE\_ID / **Grouping Dashboard Display Name:** Only available through API
  - **Grouping Key:** FLOWS\_NEXT\_RESOURCE\_TYPE / **Grouping Dashboard Display Name:** Only available through API
  - **Grouping Key:** FLOWS\_OUTCOME\_TYPE / **Grouping Dashboard Display Name:** Only available through API
  - **Grouping Key:** FLOWS\_NEXT\_RESOURCE\_QUEUE\_ID / **Grouping Dashboard Display Name:** Only available through API

- ** Bot **
  - **Grouping Key:** CHANNEL / **Grouping Dashboard Display Name:** Channel
  - **Grouping Key:** FLOWS\_RESOURCE\_ID / **Grouping Dashboard Display Name:** Flow
  - **Grouping Key:** FLOWS\_MODULE\_RESOURCE\_ID / **Grouping Dashboard Display Name:** Flow module
  - **Grouping Key:** BOT\_ID / **Grouping Dashboard Display Name:** Bot
  - **Grouping Key:** BOT\_ALIAS / **Grouping Dashboard Display Name:** Bot alias
  - **Grouping Key:** BOT\_VERSION / **Grouping Dashboard Display Name:** Bot version
  - **Grouping Key:** BOT\_LOCALE / **Grouping Dashboard Display Name:** Bot locale
  - **Grouping Key:** INITIATION\_METHOD / **Grouping Dashboard Display Name:** Initiation method
  - **Grouping Key:** BOT\_INTENT\_NAME / **Grouping Dashboard Display Name:** Bot intent (Bot Intents category only)
  - **Grouping Key:** FLOW\_ACTION\_ID / **Grouping Dashboard Display Name:** Only available through API
  - **Grouping Key:** INVOKING\_RESOURCE\_PUBLISHED\_TIMESTAMP / **Grouping Dashboard Display Name:** Only available through API
  - **Grouping Key:** PARENT\_FLOWS\_RESOURCE\_ID / **Grouping Dashboard Display Name:** Only available through API
  - **Grouping Key:** INVOKING\_RESOURCE\_TYPE / **Grouping Dashboard Display Name:** Only available through API



## Supported top-level metric filters per metric primitive category
<a name="supported-metric-filters-top-level"></a>





- ** Contact **
  - **Top Level Filter Key:** AGENT / **Top Level Filter Dashboard Display Name:** Agent / **Filter Key Description:** Valid input to this key is Agent ARNs
  - **Top Level Filter Key:** AGENT\_HIERARCHY\_LEVEL\_FIVE / **Top Level Filter Dashboard Display Name:** Agent hierarchy level five / **Filter Key Description:** Valid input to this filter, is an Agent Hierarchy Level ARN.<br />For more information, see [Agent Hierarchy Level](https://docs.aws.amazon.com/connect/latest/adminguide/agent-hierarchy.html#new-agent-hierarchy).
  - **Top Level Filter Key:** AGENT\_HIERARCHY\_LEVEL\_FOUR / **Top Level Filter Dashboard Display Name:** Agent hierarchy level four
  - **Top Level Filter Key:** AGENT\_HIERARCHY\_LEVEL\_THREE / **Top Level Filter Dashboard Display Name:** Agent hierarchy level three
  - **Top Level Filter Key:** AGENT\_HIERARCHY\_LEVEL\_TWO / **Top Level Filter Dashboard Display Name:** Agent hierarchy level two
  - **Top Level Filter Key:** AGENT\_HIERARCHY\_LEVEL\_ONE / **Top Level Filter Dashboard Display Name:** Agent hierarchy level one
  - **Top Level Filter Key:** CHANNEL / **Top Level Filter Dashboard Display Name:** Channel / **Filter Key Description:** Valid values: Voice, Chat, Task, Email
  - **Top Level Filter Key:** QUEUE / **Top Level Filter Dashboard Display Name:** Queue / **Filter Key Description:** Valid inputs to this key are Queue ARNs
  - **Top Level Filter Key:** Q\_CONNECT\_ENABLED / **Top Level Filter Dashboard Display Name:** Amazon Q / **Filter Key Description:** `TRUE` and `FALSE` are the only valid filter values. This filter helps identify whether or not agent assist is enabled as part of the flow.
  - **Top Level Filter Key:** ROUTING\_PROFILE / **Top Level Filter Dashboard Display Name:** Routing profile / **Filter Key Description:** Valid input is Routing Profile ARNs. Please read below docs for more details:+  [How Amazon Connect uses routing profiles](https://docs.aws.amazon.com/connect/latest/adminguide/concepts-routing.html) <br />+  [Contact Trace Record Data Model](https://docs.aws.amazon.com/connect/latest/adminguide/ctr-data-model.html#ctr-Agent) 
  - **Top Level Filter Key:** contact/segmentAttributes/connect:Subtype / **Top Level Filter Dashboard Display Name:** Subtype / **Filter Key Description:** For valid values, see the **connect:Subtype** table row in the [SegmentAttributes](https://docs.aws.amazon.com/connect/latest/adminguide/connect-attrib-list.html#attribs-segment-attributes) section. 
  - **Top Level Filter Key:** contact/segmentAttributes/connect:ValidationTestType / **Top Level Filter Dashboard Display Name:** Contact source / **Filter Key Description:** For valid values, see the **connect:ValidationTestType** table row in the [SegmentAttributes](https://docs.aws.amazon.com/connect/latest/adminguide/connect-attrib-list.html#attribs-segment-attributes) section. 
  - **Top Level Filter Key:** User defined attribute key  / **Top Level Filter Dashboard Display Name:** User defined attribute key / **Filter Key Description:** Navigate to the [predefined attributes page](https://docs.aws.amazon.com/connect/latest/adminguide/predefined-attributes.html) for the user defined attribute to understand what values are available. 
  - **Top Level Filter Key:** FEATURE / **Top Level Filter Dashboard Display Name:** N/A / **Filter Key Description:** Identifies if conversational analytics is enabled on the flow.contact\_lens\_conversational\_analytics is the only valid value

- ** Agent **
  - **Top Level Filter Key:** AGENT / **Top Level Filter Dashboard Display Name:** Agent / **Filter Key Description:** Valid input to this key is Agent ARNs
  - **Top Level Filter Key:** AGENT\_HIERARCHY\_LEVEL\_FIVE / **Top Level Filter Dashboard Display Name:** Agent hierarchy level five / **Filter Key Description:** Valid input to this filter, is an Agent Hierarchy Level ARN.<br />For more information, see [Agent Hierarchy Level](https://docs.aws.amazon.com/connect/latest/adminguide/agent-hierarchy.html#new-agent-hierarchy).
  - **Top Level Filter Key:** AGENT\_HIERARCHY\_LEVEL\_FOUR / **Top Level Filter Dashboard Display Name:** Agent hierarchy level four
  - **Top Level Filter Key:** AGENT\_HIERARCHY\_LEVEL\_THREE / **Top Level Filter Dashboard Display Name:** Agent hierarchy level three
  - **Top Level Filter Key:** AGENT\_HIERARCHY\_LEVEL\_TWO / **Top Level Filter Dashboard Display Name:** Agent hierarchy level two
  - **Top Level Filter Key:** AGENT\_HIERARCHY\_LEVEL\_ONE / **Top Level Filter Dashboard Display Name:** Agent hierarchy level one
  - **Top Level Filter Key:** CHANNEL / **Top Level Filter Dashboard Display Name:** Channel / **Filter Key Description:** Valid values: Voice, Chat, Task, Email
  - **Top Level Filter Key:** QUEUE / **Top Level Filter Dashboard Display Name:** Queue / **Filter Key Description:** Valid input to this key is Queue ARNs
  - **Top Level Filter Key:** ROUTING\_PROFILE / **Top Level Filter Dashboard Display Name:** Routing profile / **Filter Key Description:** Valid input is Routing Profile ARNs. Please read below docs for more details:+  [How Amazon Connect uses routing profiles](https://docs.aws.amazon.com/connect/latest/adminguide/concepts-routing.html) <br />+  [Contact Trace Record Data Model](https://docs.aws.amazon.com/connect/latest/adminguide/ctr-data-model.html#ctr-Agent) 

- ** Current Contact **
  - **Top Level Filter Key:** Channels / **Top Level Filter Dashboard Display Name:** Channel / **Filter Key Description:** Valid values: Voice, Chat, Task, Email
  - **Top Level Filter Key:** RoutingProfiles / **Top Level Filter Dashboard Display Name:** Routing profile / **Filter Key Description:** Valid input is Routing Profile ARNs. Please read below docs for more details:+  [How Amazon Connect uses routing profiles](https://docs.aws.amazon.com/connect/latest/adminguide/concepts-routing.html) <br />+  [Contact Trace Record Data Model](https://docs.aws.amazon.com/connect/latest/adminguide/ctr-data-model.html#ctr-Agent) 
  - **Top Level Filter Key:** Queues / **Top Level Filter Dashboard Display Name:** Queue / **Filter Key Description:** Valid input to this key is Queue ARNs or QueueId's
  - **Top Level Filter Key:** RoutingStepExpressions / **Top Level Filter Dashboard Display Name:** Routing step expression / **Filter Key Description:** Accepts a filter value up to 3,000 characters in length. Filter values are case-sensitive. JSON object key order and whitespace might be arbitrary; array order and tree structure must be preserved.<br />Please read the below references for more info:+  [Routing step expression guide](https://docs.aws.amazon.com/connect/latest/APIReference/API_Expression.html) <br />+  [Routing step expression examples](https://docs.aws.amazon.com/connect/latest/APIReference/API_GetCurrentMetricData.html#API_GetCurrentMetricData_Examples) 
  - **Top Level Filter Key:** Subtypes / **Top Level Filter Dashboard Display Name:** Subtype / **Filter Key Description:** For valid values, see the connect:Subtype table row in the [SegmentAttributes](https://docs.aws.amazon.com/connect/latest/adminguide/connect-attrib-list.html#attribs-segment-attributes) section.
  - **Top Level Filter Key:** ValidationTestTypes / **Top Level Filter Dashboard Display Name:** Contact source / **Filter Key Description:** For valid values, see the connect:ValidationTestType table row in the [SegmentAttributes](https://docs.aws.amazon.com/connect/latest/adminguide/connect-attrib-list.html#attribs-segment-attributes) section.

- ** Current Agent **
  - **Top Level Filter Key:** Channels / **Top Level Filter Dashboard Display Name:** Channel / **Filter Key Description:** Valid values: Voice, Chat, Task, Email
  - **Top Level Filter Key:** RoutingProfiles / **Top Level Filter Dashboard Display Name:** Routing profile / **Filter Key Description:** Valid input is Routing Profile ARNs. Please read below docs for more details:+  [How Amazon Connect uses routing profiles](https://docs.aws.amazon.com/connect/latest/adminguide/concepts-routing.html) <br />+  [Contact Trace Record Data Model](https://docs.aws.amazon.com/connect/latest/adminguide/ctr-data-model.html#ctr-Agent) 
  - **Top Level Filter Key:** Queues / **Top Level Filter Dashboard Display Name:** Queue / **Filter Key Description:** Valid input to this key is Queue ARNs or QueueId's

- ** Flow **
  - **Top Level Filter Key:** CHANNEL / **Top Level Filter Dashboard Display Name:** Channel / **Filter Key Description:** Valid values: Voice, Chat, Task, Email
  - **Top Level Filter Key:** FLOWS\_RESOURCE\_ID / **Top Level Filter Dashboard Display Name:** Flow / **Filter Key Description:** Valid input is Flow ARNs
  - **Top Level Filter Key:** FLOWS\_MODULE\_RESOURCE\_ID / **Top Level Filter Dashboard Display Name:** Flow module / **Filter Key Description:** Valid input is Flow Module ARNs
  - **Top Level Filter Key:** INITIATION\_METHOD / **Top Level Filter Dashboard Display Name:** Initiation method / **Filter Key Description:** Indicates how the contact was initiated.
  - **Top Level Filter Key:** FLOWS\_RESOURCE\_TYPE / **Top Level Filter Dashboard Display Name:** Only available through API / **Filter Key Description:** Valid values: Flow, Module
  - **Top Level Filter Key:** RESOURCE\_PUBLISHED\_TIMESTAMP / **Top Level Filter Dashboard Display Name:** Only available through API / **Filter Key Description:** Timestamp when the flow resource was published.
  - **Top Level Filter Key:** FLOWS\_NEXT\_RESOURCE\_ID / **Top Level Filter Dashboard Display Name:** Only available through API / **Filter Key Description:** ARN of the next resource.
  - **Top Level Filter Key:** FLOWS\_NEXT\_RESOURCE\_TYPE / **Top Level Filter Dashboard Display Name:** Only available through API / **Filter Key Description:** Type of resource the flow transitioned to.
  - **Top Level Filter Key:** FLOWS\_OUTCOME\_TYPE / **Top Level Filter Dashboard Display Name:** Only available through API / **Filter Key Description:** Indicates the terminal outcome of the flow.
  - **Top Level Filter Key:** FLOWS\_NEXT\_RESOURCE\_QUEUE\_ID / **Top Level Filter Dashboard Display Name:** Only available through API / **Filter Key Description:** ARN of the next queue resource.

- ** Bot **
  - **Top Level Filter Key:** CHANNEL / **Top Level Filter Dashboard Display Name:** Channel / **Filter Key Description:** Valid values: Voice, Chat, Task, Email
  - **Top Level Filter Key:** FLOWS\_RESOURCE\_ID / **Top Level Filter Dashboard Display Name:** Flow / **Filter Key Description:** Valid input is Flow ARNs
  - **Top Level Filter Key:** FLOWS\_MODULE\_RESOURCE\_ID / **Top Level Filter Dashboard Display Name:** Flow module / **Filter Key Description:** Valid input is Flow Module ARNs
  - **Top Level Filter Key:** BOT\_ID / **Top Level Filter Dashboard Display Name:** Bot / **Filter Key Description:** Valid input is Bot ID
  - **Top Level Filter Key:** BOT\_ALIAS / **Top Level Filter Dashboard Display Name:** Bot alias / **Filter Key Description:** Valid input is Bot Alias
  - **Top Level Filter Key:** BOT\_VERSION / **Top Level Filter Dashboard Display Name:** Bot version / **Filter Key Description:** Version of the Amazon Lex bot
  - **Top Level Filter Key:** BOT\_LOCALE / **Top Level Filter Dashboard Display Name:** Bot locale / **Filter Key Description:** Locale configuration of the bot.
  - **Top Level Filter Key:** INITIATION\_METHOD / **Top Level Filter Dashboard Display Name:** Initiation method / **Filter Key Description:** Indicates how the contact was initiated.
  - **Top Level Filter Key:** BOT\_INTENT\_NAME / **Top Level Filter Dashboard Display Name:** Bot intent (Bot Intents category only) / **Filter Key Description:** Name of the specific bot intent.
  - **Top Level Filter Key:** FLOW\_ACTION\_ID / **Top Level Filter Dashboard Display Name:** Only available through API / **Filter Key Description:** Flow action identifier that invoked the bot.
  - **Top Level Filter Key:** PARENT\_FLOWS\_RESOURCE\_ID / **Top Level Filter Dashboard Display Name:** Only available through API / **Filter Key Description:** ARN of the parent flow resource.
  - **Top Level Filter Key:** INVOKING\_RESOURCE\_TYPE / **Top Level Filter Dashboard Display Name:** Only available through API / **Filter Key Description:** Valid values: Flow, Module
  - **Top Level Filter Key:** INVOKING\_RESOURCE\_PUBLISHED\_TIMESTAMP / **Top Level Filter Dashboard Display Name:** Only available through API / **Filter Key Description:** Timestamp when the invoking resource was published.



## Guidelines for Metric Primitive creation and usage with out-of-the-box metrics
<a name="metric-primitive-guidelines"></a>

### Creating Custom Metric from Primitives
<a name="create-custom-metric-from-primitives"></a>

**Each metric primitive can use the same metric-level filter only once **

Each metric primitive can only use a specific filter attribute once. If you apply the same filter attribute again (even with a different value), it will overwrite your previous condition. 

**Metric primitives must be from the same category**

Metric primitives are organized into categories based on what they measure (for example, Contact metrics, Agent metrics, Queue metrics). You can only combine primitives within the same category in a single custom metric. When selecting a metric primitive, you'll see its category in the dropdown. If a metric appears disabled (grayed out), pause on it to see the why, it must be from a different category than your first selection.
+ (for example, Contact metrics, Agent metrics, Queue metrics). You can only combine primitives within the same category in a single custom metric. When selecting a metric primitive, you'll see its category in the dropdown. If a metric appears disabled (grayed out), pause on it to see why—typically because it's from a different category than your first selection.
+ When selecting a metric primitive, you'll see its category in the dropdown. If a metric appears disabled (grayed out), pause on it to see why—typically because it's from a different category than your first selection.

**Arithmetic operations on metric primitives require consistent filters**

When performing arithmetic operations (\+, -, \*, /) on multiple metric primitives within a single statistic, all primitives must use the same filter attribute.

Important: The filter values can differ; only the filter attribute must match. 

Example: if the custom metric definition is of the form, SUM(Metric-1 \+ Metric-2), here the Metric-1 and Metric-2 must use consistent filters 

**Arithmetic operations on statistics operations support metric primitive with different filters** 

When performing arithmetic operations (\+, -, \*, /) on multiple statistics operations, you can combine metric primitive groups having different filters.

Example: 
+ Metric-1: a metric primitive from Contact category using Queue Time as a filter
+ Metric-2: a metric primitive from Contact category using Contact Handle Time as a filter
+ Valid custom metric definition: SUM(Metric-1) \+ SUM(Metric-2)

**Metrics only support specific statistics**

Not every metric primitive supports all statistic operations (SUM, AVG, MIN, MAX). Using an unsupported statistic will cause an error.

Some metrics are only meaningful with certain calculations:
+ **Count-based metrics** (for example, Contacts Created): supports SUM, as AVG does not make sense
+ **Duration metrics** (for example, Contact Handle Time): support AVG, SUM, MIN, MAX

**A custom metric must have 1 to 5 components**

A component is each individual metric primitive you add to your custom metric definition. If you're combining three different metrics, that's three components.
+ **Minimum**: 1 component (you must have at least one metric)
+ **Maximum**: 5 components per custom metric

**Note**  
A custom metric using a metric primitive of **Current Contact** or **Current Agent** category can support at most 1 component.

**A statistic operation can support at most contain 10 elements (either components or constants)**

Each statistic operation (SUM, AVG) can contain a maximum of 10 elements.

**What Counts as an Element?**

Both of these count toward the 10-element limit:
+ **Component identifiers** (for example, Metric\_1, Metric\_2)
+ **Constants/numbers** (for example, 100, 0.5)

### Guidelines for using custom metrics with out-of-the-box metrics
<a name="using-custom-metrics-guidelines"></a>

A custom metric can only be added to a dashboard widget if the metric's underlying primitives support ALL filters and groupings applied to that widget.

Common Scenario: You create a custom metric using "Agent Idle Time" primitive, which does NOT support "Channel" as a filter or grouping dimension. 

Result: You cannot add this custom metric to any widget that: 
+ Filters by Channel, OR
+ Groups data by Channel 

Refer to the Metric Primitive definition section for supported filters and groupings of metric primitives. 