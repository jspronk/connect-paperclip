

# Data model for Connect Customer contact records
<a name="ctr-data-model"></a>

**Note**  
End of support notice: On May 20, 2026, AWS will end support for Amazon Connect Customer Voice ID. After May 20, 2026, you will no longer be able to access Voice ID on the Amazon Connect Customer console, access Voice ID features on the Connect Customer admin website or Contact Control Panel, or access Voice ID resources. For more information, visit [Amazon Connect Customer Voice ID end of support](https://docs.aws.amazon.com/connect/latest/adminguide/amazonconnect-voiceid-end-of-support.html). 

This article describes the data model for Connect Customer contact records. Contact records capture the events associated with a contact in your contact center. Real-time and historical metrics are based on the data captured in the contact records.

## Important things to know
<a name="important-things-to-know-ctr-data-model"></a>

Keep the following in mind when you work with Connect Customer contact records:
+ We continually release new features that result in the addition of new fields to the contact records data model. Any changes we make to the data model are backward compatible. When you develop applications, we recommend that you build them to ignore the addition of new fields in the contact records data model. This will help ensure your applications are resilient.
+ Connect Customer delivers contact records at least once. Contact records might be delivered again for multiple reasons, such as new information arriving after initial delivery. For example, when you use the [update-contact-attributes](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/connect/update-contact-attributes.html) CLI command to update a contact record, Connect Customer delivers a new contact record. This contact record is available for 24 months from the time the associated contact was initiated.

  If you're building a system that consumes contact record export streams, be sure to include logic that checks for duplicate contact records for a contact. Use the **LastUpdateTimestamp** property to determine if a copy contains new data than previous copies. Then use the **ContactId** property for deduplication. 
+ Every action taken on a unique contact generates an event. These events appear as a field or an attribute on the contact record. If the number of actions for a contact exceeds a threshold, such as an internal storage limit, then any actions that follow will not appear on that contact record.
+ For the contact record retention period and maximum size of the attributes section of a contact record, see [Connect Customer feature specifications](feature-limits.md).
+ For information about when a contact record is created (and thus can be exported or used for data reporting), see [Events in the contact record](about-contact-states.md#ctr-events).
+ For a list of all contact attributes, including telephony call and case attributes, see [List of available contact attributes in Connect Customer and their JSONPath references](connect-attrib-list.md).
+ In the past we referred to *contact records* as *Contact Trace Records (CTR)*. Now we use the term *contact record* only. There is no difference between the two terms.
+ You can delete personally identifiable information (PII) from a terminated contact and its contact record using the [DeleteContactData API reference](https://docs.aws.amazon.com/connect/latest/APIReference/API_DeleteContactData.html). When you redact a field, the DeleteContactData API sets its value to `null` and updates the `connect:RedactedFields` segment attribute with the categories of PII that you redacted. This operation permanently deletes the specified PII; you cannot undo it. For more information, see the [SegmentAttributes](#segmentattributes) field and [Segment attributes](connect-attrib-list.md#attribs-segment-attributes).

## Agent
<a name="ctr-Agent"></a>

Information about the agent who accepted the incoming contact.

**AcceptedByAgentTimestamp**  <a name="AcceptedByAgentTimestamp-CTR"></a>
The date and time the outbound campaigns voice contact in preview dialing mode was accepted by the agent, in UTC time.  
Type: String (yyyy-mm-ddThh:mm:ssZ)

**AgentInteractionDuration**  <a name="AgentInteractionDuration-CTR"></a>
The time, in whole seconds, that an agent interacted with a customer. For outbound calls, this is the time, in whole seconds, that an agent was connected to a contact, even if the customer is not present.   
This does not include agent pause duration (which applies only to tasks).  
Type: Integer  
Min value: 0

**AgentPauseDuration**  <a name="AgentPauseDuration-CTR"></a>
The time, in whole seconds, that a task assigned to an agent was paused.  
Type: Integer  
Min value: 0

**AfterContactWorkDuration**  <a name="AfterContactWorkDuration-CTR"></a>
The difference in time, in whole seconds, between `AfterContactWorkStartTimestamp` and `AfterContactWorkEndTimestamp`.  
Type: Integer  
Min value: 0

**AfterContactWorkEndTimestamp**  
The date and time when the agent stopped doing After Contact Work for the contact, in UTC time.  
Type: String (*yyyy*-*mm*-*dd*T*hh*:*mm*:*ss*Z)

**AfterContactWorkStartTimestamp**  
The date and time when the agent started doing After Contact Work for the contact, in UTC time.   
Type: String (*yyyy*-*mm*-*dd*T*hh*:*mm*:*ss*Z)

**ActiveRegion**  
The AWS Region where the agent handled the contact.  
This value may differ from the Region in the agent ARN. For cross-region contacts routed via Connect Customer Global Resiliency, the Regions embedded in the CTR ARNs (for example, contact ARN, agent ARN, queue ARN) reflect the Region of the CTR stream itself; CTRs are generated in the Region where the contact originates. Meanwhile, the agent who handled the contact could have been connected to a different Region based on their Traffic Distribution Group configuration. For example, if a contact originates in `us-east-1` but is routed to an agent in `us-west-2` via cross-region routing for ACGR, the CTR for that contact is published from `us-east-1`, the contact's `OriginRegion` returns `us-east-1`, and the `ActiveRegion` field in the `Agent` object returns `us-west-2`.
Type: String

**ARN**  
The Amazon Resource Name of the agent.  
Type: ARN

**Capabilities**  
Information about Agent's capabilities.  
Type: Capabilities

**ConnectedToAgentTimestamp**  
The date and time the contact was connected to the agent, in UTC time.  
Type: String (*yyyy*-*mm*-*dd*T*hh*:*mm*:*ss*Z)

**CustomerHoldDuration**  <a name="CustomerHoldDuration-CTR"></a>
The time, in whole seconds, that the customer spent on hold while connected to the agent.  
Type: Integer  
Min value: 0

**AgentInitiatedHoldDuration**  <a name="AgentInitiatedHoldDuration-CTR"></a>
The total time, in whole seconds, that a specific agent placed a customer on hold. In multi-party scenarios, if Agent A puts a customer on hold and then drops from the call, and Agent B later takes the customer off hold, the remaining hold duration is attributed to Agent B.  
The key distinction between CustomerHoldDuration and AgentInitiatedHoldDuration is:  
+ CustomerHoldDuration tracks all hold time from a customer's perspective.
+ AgentInitiatedHoldDuration tracks hold time initiated by specific agents, making it especially valuable in multi-party call scenarios.
For non-multiparty scenarios, CustomerHoldDuration and AgentInitiatedHoldDuration will be the same.  
Type: Integer  
Min value: 0

**DeviceInfo**  
Information about agent's device.  
Type: [DeviceInfo](#ctr-deviceinfo) 

**HierarchyGroups**  
The agent hierarchy groups for the agent.  
Type: [AgentHierarchyGroups](#ctr-AgentHierarchyGroups)

**LongestHoldDuration**  
The longest time, in whole seconds, that the customer was put on hold by the agent.  
Type: Integer  
Min value: 0

**NumberOfHolds**  
The number of times the customer was put on hold while connected to the agent.  
Type: Integer  
Min value: 0

**PreviewEndTimestamp**  
The date and time the agent finishes previewing outbound campaigns voice contact in preview dialing mode, in UTC time.  
Type: String (yyyy-mm-ddThh:mm:ssZ)

**RoutingProfile**  
The routing profile of the agent.  
Type: [RoutingProfile](#ctr-RoutingProfile)

**Username**  
The username of the agent.  
Type: String  
Length: 1-100

**StateTransitions**  
The state transitions of a supervisor.  
Type: Array of [StateTransitions](#ctr-StateTransitions).

## AgentHierarchyGroup
<a name="ctr-AgentHierarchyGroup"></a>

Information about an agent hierarchy group.

**ARN**  
The Amazon Resource Name (ARN) of the group.  
Type: ARN

**GroupName**  
The name of the hierarchy group.  
Type: String  
Length: 1-256

## AgentHierarchyGroups
<a name="ctr-AgentHierarchyGroups"></a>

Information about the agent hierarchy. Hierarchies can be configured with up to five levels.

**Level1**  
The group at level one of the agent hierarchy.  
Type: [AgentHierarchyGroup](#ctr-AgentHierarchyGroup)

**Level2**  
The group at level two of the agent hierarchy.  
Type: [AgentHierarchyGroup](#ctr-AgentHierarchyGroup)

**Level3**  
The group at level three of the agent hierarchy.  
Type: [AgentHierarchyGroup](#ctr-AgentHierarchyGroup)

**Level4**  
The group at level four of the agent hierarchy.  
Type: [AgentHierarchyGroup](#ctr-AgentHierarchyGroup)

**Level5**  
The group at level five of the agent hierarchy.  
Type: [AgentHierarchyGroup](#ctr-AgentHierarchyGroup)

## AttributeCondition
<a name="ctr-AttributeCondition"></a>

An object to specify the predefined attribute condition.

**Name**  
The name of predefined attribute.  
Type: String  
Length: 1-64

**Value**  
The value of predefined attribute.  
Type: String  
Length: 1-64

**ComparisonOperator**  
The comparison operator of the condition.  
Type: String  
Valid values: NumberGreaterOrEqualTo, Match, Range

**ProficiencyLevel**  
The proficiency level of the condition.  
Type: Float  
Valid values: 1.0, 2.0, 3.0, 4.0 and 5.0

**Range**  
An Object to define the minimum and maximum proficiency levels.  
Type: Range object

**MatchCriteria**  
An object to define AgentsCriteria.  
Type: MatchCriteria object

**AgentsCriteria**  
An Object to define agentIds.  
Type: AgentsCriteria object

**AgentIds**  
An object to specify a list of agents, by Agent ID.  
Type: Array of strings  
Length Constraints: Maximum length of 256

## ChatMetrics
<a name="ctr-ChatMetrics"></a>

Information about how agent, bot and customer interact in a chat contact. ChatMetrics includes the following sub-categories: [ContactMetrics](#ctr-ContactMetrics), [CustomerMetrics](#ctr-CustomerMetrics), and [AgentMetrics](#ctr-AgentMetrics). 

## ContactMetrics
<a name="ctr-ContactMetrics"></a>

Information about the overall participant interactions at the contact level, which includes the following metrics:

**MultiParty**  
A Boolean flag indicating whether multiparty chat or supervisor barge were enabled on this contact.  
Type: Boolean

**TotalMessages**  
The number of chat messages on the contact.  
Type: Integer  
Min value: 0

**TotalBotMessages**  
The total number of bot and automated messages on a chat contact.  
Type: Integer  
Min value: 0

**TotalBotMessageLengthInChars**  
The total number of characters from bot and automated messages on a chat contact.  
Type: Integer  
Min value: 0

**ConversationCloseTimeInMillis**  
The time it took for a contact to end after the last customer message.  
Type: Long  
Min value: 0

**ConversationTurnCount**  
The number of conversation turns in a chat contact.  
Type: Integer  
Min value: 0

**AgentFirstResponseTimestamp**  
The agent first response Timestamp for a chat contact.  
Type: String (yyyy-mm-ddThh:mm:ssZ)

**AgentFirstResponseTimeInMillis**  
The time for an agent to respond after obtaining a chat contact.  
Type: Long  
Min value: 0

## CustomerMetrics
<a name="ctr-CustomerMetrics"></a>

Information about customer interactions in a contact, which includes the following metrics:

**Type**  
 [ParticipantMetrics](#ctr-ParticipantMetrics) Object

## AgentMetrics
<a name="ctr-AgentMetrics"></a>

Information about agent interactions in a contact, which includes the following metrics:

**Type**  
 [ParticipantMetrics](#ctr-ParticipantMetrics) Object

## ParticipantMetrics
<a name="ctr-ParticipantMetrics"></a>

Information about individual participant metrics in a chat contact.

**ParticipantId**  
The Participant's participant ID.  
Type: String  
Length: 1-256

**ParticipantType**  
Information about the conversation participant. The following participant types are supported: Agent, Customer, Supervisor.  
Type: String

**ConversationAbandon**  
A Boolean flag indicating whether the chat conversation was abandoned by Participant.  
Type: Boolean

**MessagesSent**  
The number of chat messages sent by Participant.  
Type: Integer  
Min value: 0

**NumResponses**  
The number of responses sent by Participant.  
Type: Integer  
Min value: 0

**MessageLengthInChars**  
The number of chat characters sent by Participant.  
Type: Integer  
Min value: 0

**TotalResponseTimeInMillis**  
The total chat response time by Participant.  
Type: Long  
Min value: 0

**MaxResponseTimeInMillis**  
The maximum chat response time by Participant.  
Type: Long  
Min value: 0

**LastMessageTimestamp**  
The Timestamp of last chat message by Participant.  
Type: String (yyyy-mm-ddThh:mm:ssZ)

## ContactDetails
<a name="ctr-contact-details"></a>

Contains user-defined attributes which are lightly typed within the contact. 

This object is used only for task contacts. For voice or chat contacts, or for tasks that have contact attributes set with the flow block, check the [ContactTraceRecord](#ctr-ContactTraceRecord) Attributes object. 

**ContactDetailsName**  
Type: String  
Length: 1-128

**ContactDetailsValue**  
Type: String  
Length: 0-1024

**ReferenceAttributeName**  
Type: String  
Length: 1-128

**ReferenceAttributesValue**  
Type: String  
Length: 0-1024

## ContactTraceRecord
<a name="ctr-ContactTraceRecord"></a>

Information about a contact.

To learn about all system-defined segment attributes, see [Segment attributes](connect-attrib-list.md#attribs-segment-attributes). 

**Agent**  
If this contact successfully connected to an agent, this is information about the agent.  
Type: [Agent](#ctr-Agent)

**Customer**  
Information about the person (customer) who contacts your contact center.  
Type: [Customer](#ctr-Customer)

**AgentConnectionAttempts**  
The number of times Connect Customer attempted to connect this contact with an agent.  
Type: Integer  
Min value: 0

**Attributes**  
The contact attributes, formatted as a map of keys and values.  
Type: Attributes  
Members: `AttributeName`, `AttributeValue` 

**AWSAccountId**  
The ID of the AWS account that owns the contact.  
Type: String

**AWSContactTraceRecordFormatVersion**  
The record format version.  
Type: String

**Channel**  
How the contact reached your contact center.  
Valid values: `VOICE`, `CHAT`, `TASK`, `EMAIL`

**ConnectedToSystemTimestamp**  
The date and time the customer endpoint connected to Connect Customer, in UTC time. For `INBOUND`, this matches InitiationTimestamp. For `OUTBOUND`, `CALLBACK`, and `API`, this is when the customer endpoint answers.  
Type: String (*yyyy*-*mm*-*dd*T*hh*:*mm*:*ss*Z)

**ContactId**  
The ID of the contact.  
Type: String  
Length: 1-256

**ContactLens**  
Information about conversational analytics features applied to this contact.  
Type: [ContactLens](#ctr-ContactLens) 

**CustomerId**  
The customer's identification number. For example, the CustomerId might be a customer number from your CRM. You can create a Lambda function to pull the unique customer ID of the caller from your CRM system. If you enable Connect Customer Voice ID capability, this attribute is populated with the CustomerSpeakerId of the caller.  
Type: String 

**CustomerEndpoint**  
The customer or external third party participant endpoint.  
Type: [Endpoint](#ctr-endpoint), `EMAIL_ADDRESS`  
If you redacted this field using the [DeleteContactData API reference](https://docs.aws.amazon.com/connect/latest/APIReference/API_DeleteContactData.html) (by specifying `CUSTOMER_ENDPOINT`), the DeleteContactData API sets this field to `null`. The `connect:RedactedFields` segment attribute lists the categories of PII that you redacted from the contact. For more information, see [SegmentAttributes](#segmentattributes).

**CustomerVoiceActivity**  
This field is populated for calls using answering machine detection (AMD), which is only available for Outbound Campaigns. Otherwise, this field is null.  
The `CustomerVoiceActivity` object includes the following properties:    
**GreetingStartTimestamp**  
The date and time that measures the beginning of the customer greeting from an outbound voice call, in UTC time.   
Type: String (yyyy-MM-dd'T'HH:mm:ss.SSS'Z')  
**GreetingEndTimestamp**  
The date and time that measures the end of the customer greeting from an outbound voice call, in UTC time.   
Type: String (yyyy-MM-dd'T'HH:mm:ss.SSS'Z')

**DisconnectTimestamp**  
The date and time that the customer endpoint disconnected from the current contact, in UTC time. In transfer scenarios, the DisconnectTimestamp of the previous contact indicates the date and time when that contact ended.  
Type: String (*yyyy*-*mm*-*dd*T*hh*:*mm*:*ss*Z)

**DisconnectReason**  
Indicates how the contact was terminated. This data is available in the Connect Customer contact record stream and **Contact details** page.  
The disconnect reason standardizes responses across different telephony providers into unified disconnect reasons. This helps you identify issues such as invalid numbers, call rejections, and spam blocking (both temporary and permanent). With these definitive telephony events, you can make data-driven decisions about how to handle call terminations.  
Type: String  
Voice contacts can have the following disconnect reasons:  
+ `TELECOM_BUSY` – The call attempt to the third party returns a network busy signal. This indicates the endpoint you are trying to call currently cannot take a call because it is currently engaged.
+ `TELECOM_NUMBER_INVALID` – The number you are attempting to call either lacks proper E164 formatting, or the number you are attempting to call does not exist or is no longer in use.
+ `TELECOM_POTENTIAL_BLOCKING` – The call attempt to the customer receives a response from multiple networks that suggest the number currently faces blocking based on network level blocks.

  BlockReason – If the call is formally blocked using the 603\+ "Network Blocked", the [ FCC-mandated standard](https://docs.fcc.gov/public/attachments/FCC-25-15A1.pdf) that provides a uniform informative message that you can process and seek correction with the end customers carrier if you believe the traffic is blocked for invalid reasons, see [Segment attributes](connect-attrib-list.md#attribs-segment-attributes) for detail.
**Note**  
Amazon Connect helps customers flag spam blocking based on its own best practice. Because spam blocking lacks global unification, a very small number of false positives might occur in this category. Amazon Connect expects to see around 1% of calls have this effect. If blocking occurs, we recommend you review the carrier network you are calling, and you should contact the carrier you are attempting to call to determine why the call faced blocking. Due to blocking rules, AWS cannot unblock networks on your behalf.
+ `TELECOM_UNANSWERED` – Amazon Connect attempts to deliver the call through multiple routes and currently receives messages from either the network or the handset confirming that the system cannot deliver the call at this time.
+ `TELECOM_TIMEOUT` – If the call attempt occurs on multiple networks and reaches 60 seconds of ringing, the system reports that it has reached the timeout point for this call attempt.
+ `TELECOM_ORIGINATOR_CANCEL` – This occurs when the call is cancelled by the originating party before the connection to the Connect Customer system is established. For inbound calls, this happens when the customer cancels the call before connecting to the Connect Customer system. For outbound calls, this occurs when the agent/API user cancels the call before connecting, or when the call remains unanswered after 60 seconds.
+ `TELECOM_PROBLEM` – If we try to reach this customer through multiple networks and receive responses from the PSTN that indicate a problem exists with the destination network where we cannot reach the end network but believe the number remains valid, this reason code applies.
**Note**  
Amazon Connect attempts to make calls as part of outbound configuration with multiple providers as our coverage guide shows. If the guide indicates multi-carrier setup, the result from multiple networks shows the problem links to the third-party network. Amazon Connect expects around 2% of calls on average to have this effect. You do not need to report any telecom problem to AWS Support, and this does not represent an Amazon Connect failure.
+ `CUSTOMER_NEVER_ARRIVED` – When someone creates an inbound web calling contact, Amazon Connect automatically terminates the contact if the customer doesn't connect within a specified period of time. 
+ `THIRD_PARTY_DISCONNECT` – If a call connects with the customer and agent engaging, this flag triggers if the remote side of the call initiates the disconnect.
+ `CUSTOMER_DISCONNECT` – After a call connects to the Connect Customer system, this flag triggers if the customer side of the call initiates the disconnect. This applies regardless of whether the customer has been connected to an agent. This state cannot distinguish between poor reception and deliberate disconnection.
+ `AGENT_DISCONNECT` – If a call connects with the customer and agent engaging, this flag triggers if the agent side of the call initiates the disconnect.
+ `BARGED` – If a call connects with the customer and agent engaging but a manager disconnects the agent from the call.
+ `CONTACT_FLOW_DISCONNECT` – Indicates the contact faced termination by a disconnect/hang up block within the contact flow.
+ `OTHER` – Indicates disconnection reasons not covered by the preceding codes, such as disconnections that API calls initiate.
Outbound campaign voice contacts can have the following disconnect reasons:  
+ `OUTBOUND_DESTINATION_ENDPOINT_ERROR`: Current configurations do not allow this destination to be dialed (for example, calling an endpoint destination from an ineligible instance).
+ `OUTBOUND_RESOURCE_ERROR`: Instance has insufficient permissions to make outbound calls or necessary resources were not found.
+ `OUTBOUND_ATTEMPT_FAILED`: There was an unknown error, invalid parameter, or insufficient permissions to call the API.
+ `OUTBOUND_PREVIEW_DISCARDED`: No contact made; recipient removed from list; no further attempts will be made.
+ `EXPIRED`: Not enough agents available, or not enough telecom capacity for such calls.
Chats can have the following disconnect reasons:  
+ `AGENT_DISCONNECT`: Agent explicitly disconnects or rejects a chat.
+ `CUSTOMER_DISCONNECT`: Customer explicitly disconnects.
+ `AGENT_NETWORK_DISCONNECT`: Agent disconnected from the chat due to network issue.
+ `CUSTOMER_CONNECTION_NOT_ESTABLISHED`: Customer starts chat but never gets connection (websocket or streaming).
+ `EXPIRED`: Chat disconnected due to expiration of configured chat duration.
+ `CONTACT_FLOW_DISCONNECT`: Chat was disconnected or completed by a flow.
+ `API`: The StopContact API was called to end the chat.
+ `BARGED`: Manager disconnected the agent from the barged-in chat.
+ `IDLE_DISCONNECT`: Disconnect due to an idle participant.
+ `THIRD_PARTY_DISCONNECT`: In chat that involves multiple participants, if Agent 1 disconnects Agent 2 while the contact is still on the chat, Agent 2's disconnect reason is `THIRD_PARTY_DISCONNECT`. 
+ `SYSTEM_ERROR`: An error in the system causing a chat session to end abnormally.
The disconnect reason will be recorded as 'null' for contacts that end for reasons outside of the preceding list.  
Tasks can have the following disconnect reasons:  
+ `AGENT_COMPLETED`: Agent completed the actions required for the task and disconnected the contact before allotted time expired. (Applicable for TASK contacts)
+ `AGENT_DISCONNECT`: Agent marked the task as complete.
+ `EXPIRED`: Task expired automatically because it was not assigned or completed within 7 days.
+ `CONTACT_FLOW_DISCONNECT`: Task was disconnected or completed by a flow.
+ `API`: The [StopContact](https://docs.aws.amazon.com/connect/latest/APIReference/API_StopContact.html) API was called to end the task.
+ `OTHER`: This includes any reason not explicitly covered by the previous codes.
Emails can have the following disconnect reasons:  
+ `TRANSFERRED`: The email contact was transferred to another queue or to another agent.
+ `AGENT_DISCONNECT`: An agent disconnected or closed the email contact without responding to it.
+ `EXPIRED`: The email contact expired before it could be accepted or handled by an agent. This could be due to agents not being available, or the queue capacity was not enough to handle the email before is expired.
+ `DISCARDED`: The outbound (agent replies or agent-initiated) email contact was discarded in draft state.
+ `CONTACT_FLOW_DISCONNECT`: The email contact was disconnected in a flow.
+ `API`: The [StopContact](https://docs.aws.amazon.com/connect/latest/APIReference/API_StopContact.html) API was called to end the email contact.
+ `OTHER`: This includes any reason not explicitly covered by the previous reasons.

**AnsweringMachineDetectionStatus**  
Indicates how an [outbound campaign](how-to-create-campaigns.md) call is actually disposed if the contact is connected to Connect Customer.  
Valid values:  
+ `HUMAN_ANSWERED`: The number dialed was answered by a person.
+ `VOICEMAIL_BEEP`: The number dialed was answered by voicemail with a beep.
+ `VOICEMAIL_NO_BEEP`: The number dialed was answered by a voicemail with no beep.
+ `AMD_UNANSWERED`: The number dialed kept ringing, but the call was not picked up.
+ `AMD_UNRESOLVED`: The number dialed was connected but the answering machine detection could not determine whether the call was picked up by a person or voicemail.
+ `AMD_UNRESOLVED_SILENCE`: The number dialed was connected but the answering machine detection observed silence.
+ `AMD_NOT_APPLICABLE`: The call disconnected before ringing, and there was no media to detect.
+ `SIT_TONE_BUSY`: The number dialed was busy
+ `SIT_TONE_INVALID_NUMBER`: The number dialed was not a valid number.
+ `SIT_TONE_DETECTED`: A special information tone (SIT) was detected.
+ `FAX_MACHINE_DETECTED`: A fax machine was detected.
+ `AMD_ERROR`: The number dialed was connected, but there was an error in answering machine detection.

**InitialContactId**  
The identifier of the initial contact.  
Type: String  
Length: 1-256

**InitiationMethod**  
Indicates how the contact was initiated. For more information, see [Contact initiation methods and flow types in your Connect Customer contact center](contact-initiation-methods.md).  
Valid values:  
+  `INBOUND`: The customer initiated voice (phone) contact with your contact center. 
+  `OUTBOUND`: An agent initiated voice (phone) contact with the customer, by using the CCP to call their number.
+  `TRANSFER`: The customer was transferred by an agent to another agent or to a queue, using quick connects in the CCP. This results in the creation of a new contact record.
+  `CALLBACK`: The customer was contacted as part of a callback flow. 

  For more information about the InitiationMethod in this scenario, see [Queued callbacks in real-time metrics in Connect Customer](about-queued-callbacks.md). 
+  `API`: The contact was initiated with Connect Customer by API. This could be an outbound contact you created and queued to an agent, using the [StartOutboundVoiceContact](https://docs.aws.amazon.com/connect/latest/APIReference/API_StartOutboundVoiceContact.html) API, or it could be a live chat that was initiated by the customer with your contact center, where you called the [StartChatConnect](https://docs.aws.amazon.com/connect/latest/APIReference/API_StartChatContact.html) API.
+  `WEBRTC_API`: The contact used the communication widget with video call.
+  `QUEUE_TRANSFER`: While the customer was in one queue (listening to Customer queue flow), they were transferred into another queue using a flow block.
+  `EXTERNAL_OUTBOUND`: An agent initiated voice (phone) contact with an external participant to your contact center using either quick connect in the CCP or a flow block.
+  `MONITOR`: A supervisor initiated monitor on an agent. The supervisor can silently monitor the agent and customer, or barge the conversation.
+  `DISCONNECT`: When a [Set disconnect flow](set-disconnect-flow.md) block is triggered, it specifies which flow to run after a disconnect event during a contact. 

  A disconnect event is when:
  + A voice call ends when the customer hangs up, the agent hangs up, or the call drops because of a telecom or network issue.
  + A chat, or task is disconnected.
  + A task is disconnected as a result of a flow action.
  + A task expires. The task is automatically disconnected when it completes its expiry timer. The default is 7 days and task expiry is configurable up to 90 days. 

  If a new contact is created while running a disconnect flow, then the initiation method for that new contact is DISCONNECT.
+  `AGENT_REPLY`: An agent has replied to an inbound email contact to create an outbound email reply.
+  `FLOW`: An email intiated by the [Send message](send-message.md) block.
+  `CAMPAIGN_PREVIEW`: The contact was initiated by an outbound campaign using preview dialing mode. The agent previews customer information before the call is placed.

**InitiationTimestamp**  
The date and time this contact was initiated, in UTC time.   
+ For `INBOUND`, this is when the contact arrived.
+ For `OUTBOUND`, this is when the agent began dialing.
+ For `CALLBACK`, this is when the callback contact was created.
+ For `EXTERNAL_OUTBOUND`, this is when the agent started dialing the external participant.
+  For `MONITOR`, this is when the manager started listening to a contact. 
+ For `TRANSFER` and `QUEUE_TRANSFER`, this is when the transfer was initiated.
Type: String (*yyyy*-*mm*-*dd*T*hh*:*mm*:*ss*Z)  
In the case of tasks, InitiationTimestamp signifies when the task contact was created, whereas EnqueueTimestamp signifies time when the task contact was put in a queue to match the contact with agent.   
You can configure flows so there is processing done on the task before a contact is queued. For example, this processing can take one minute or maybe several days. Many tasks, especially those used for backoffice processing aren't queued so they might have an InitiationTimestamp but not an EnqueueTimestamp.   
Scheduled tasks get initiated when a contact is created, however they only start running flows when the schedule is met.   
The 7 days expiry value is not absolute and there could be cases where tasks expire just beyond 7 days ( 7.01 days )

**InstanceARN**  
The Amazon Resource Name of the Connect Customer instance.  
Type: ARN

**LastUpdateTimestamp**  
The date and time this contact was last updated, in UTC time.  
Type: String (*yyyy*-*mm*-*dd*T*hh*:*mm*:*ss*Z)

**LastPausedTimestamp**  
The date and time this contact was last paused, in UTC time.  
Type: String (*yyyy*-*mm*-*dd*T*hh*:*mm*:*ss*Z)

**LastResumedTimestamp**  
The date and time this contact was last resumed, in UTC time.  
Type: String (*yyyy*-*mm*-*dd*T*hh*:*mm*:*ss*Z)

**MediaStreams**  
The media streams.  
Type: Array of [MediaStream](#MediaStream)

**NextContactId**  
The ID of the contact created when:  
+ An agent uses a Quick Connect or the number pad on the CCP.
—or—  
+ One of the following flow blocks is run:
  + [Transfer to flow](transfer-to-flow.md)
  + [Transfer to queue](transfer-to-queue.md)
  + [Set disconnect flow](set-disconnect-flow.md)
—or—  
+ An additional WebRTC (audio or video) participant is added.
Type: String  
Length: 1-256

**OutboundStrategy**  
Information about the outbound strategy.  
Type: [OutboundStrategy](https://docs.aws.amazon.com/connect/latest/APIReference/API_OutboundStrategy.html) object

**PreviousContactId**  
The ID of the previous contact from which the current contact is created when:  
+ An agent uses a Quick Connect or the number pad on the CCP.
—or—  
+ One of the following flow blocks is run:
  + [Transfer to flow](transfer-to-flow.md)
  + [Transfer to queue](transfer-to-queue.md)
  + [Set disconnect flow](set-disconnect-flow.md)
—or—  
+ An additional WebRTC (audio or video) participant is added.
Type: String  
Length: 1-256

**Queue**  
If this contact was queued, this is information about the queue.  
Type: [QueueInfo](#ctr-QueueInfo)

**Campaign**  
Information associated with a campaign.  
Type: [Campaign](https://docs.aws.amazon.com/connect/latest/APIReference/API_Campaign.html) object

**DisconnectDetails**  
Information about the call disconnect experience.  
Type: [DisconnectDetails](#ctr-disconnectdetails)

**QualityMetrics**  
Information about the quality of participant's media connection when the participant is talking during the call.  
Type: [QualityMetrics](#ctr-qualitymetrics)

**Recording**  
If recording was enabled, this is information about the recording.  
Type: [RecordingInfo](#ctr-RecordingInfo)

**Recordings**  
If recording was enabled, this is information about the recording.  
Type: Array of [RecordingsInfo](#ctr-RecordingsInfo)  
The first recording for a contact will appear in both the Recording and Recordings sections of the contact record.

**agent assist**  
If Amazon Q was enabled on the contact, this is information about the Amazon Q session.  
Type: [WisdomInfo](#ctr-wisdominfo)

**RelatedContactId**  
If this contact is associated with another contact, this is the identifier of the related contact.  
Type: String  
Length: 1-256.

**RingStartTimestamp**  
The date and time that ringing started for a campaign call, in UTC time. Connect Customer populates this field only for outbound campaign calls.  
Type: String (*yyyy*-*mm*-*dd*T*hh*:*mm*:*ss*Z)

**ScheduledTimestamp**  
The date and time when this contact was scheduled to trigger the flow to run, in UTC time. This is supported only for the task channel.  
Type: String (*yyyy*-*mm*-*dd*T*hh*:*mm*:*ss*Z)

**SegmentAttributes**  
A set of system defined key-value pairs stored on individual contact segments using an attribute map. The attributes are standard Connect Customer attributes and can be accessed in flows. Attribute keys can include only alphanumeric, -, and \_ characters.  
SegmentAttributes are where the email subject and SES flags are stored for email contacts.  
This field can be used to show channel subtype. For example, `connect:Guide` or `connect:SMS`.  
When you redact PII from a contact using the [DeleteContactData API reference](https://docs.aws.amazon.com/connect/latest/APIReference/API_DeleteContactData.html), the `connect:RedactedFields` segment attribute appears in the contact record, listing the categories of PII that you redacted, for example `CUSTOMER_ENDPOINT,EMAIL_SUBJECT`. If you redact the `EMAIL_SUBJECT` category, the DeleteContactData API sets the value of the `connect:EmailSubject` segment attribute to `null`. For more information, see [Segment attributes](connect-attrib-list.md#attribs-segment-attributes).  
Type: SegmentAttributes   
Members: SegmentAttributeName, SegmentAttributeValue

**SystemEndpoint**  
The system endpoint. For `INBOUND`, this is the phone number that the customer dialed. For `OUTBOUND` and `EXTERNAL_OUTBOUND`, this is the outbound caller ID number assigned to the outbound queue that is used to dial the customer. For `CALLBACK`, this is the caller ID number used to dial out to customer. If a caller ID number is explicitly configured in the Transfer to Queue block, that number is used to dial out to the customer. If no caller ID is configured in the Transfer to Queue block, the outbound caller ID number configured in the queue is used to dial out to the customer. If no caller ID is configured, SystemEndpoint value will show up as anonymous.  
When [Transfer to phone number](transfer-to-phone-number.md) block is used without specifying a custom caller ID, the caller ID of the caller is passed as the caller ID. For example, if you transfer to an external number and no custom caller ID is used to specify that the call is coming from your organization, then the contact's caller ID is displayed to the external party.  
Type: [Endpoint](#ctr-endpoint), `EMAIL_ADDRESS`

**AdditionalEmailRecipients**  
The To and CC fields.  
Type: String  
Length: 1-256  
If you redacted this field using the [DeleteContactData API reference](https://docs.aws.amazon.com/connect/latest/APIReference/API_DeleteContactData.html) (by specifying `ADDITIONAL_EMAIL_RECIPIENTS`), the DeleteContactData API sets this field to `null`. This category is supported only for contacts in the email channel. The `connect:RedactedFields` segment attribute lists the categories of PII that you redacted from the contact. For more information, see [SegmentAttributes](#segmentattributes).

**ContactAssociationId**  
A contact identifier that is common across all contacts linked by relatedContactId. This is used for email contacts in a thread.  
Type: String 

**TotalPauseCount**  
Total number of pauses including when the contact was not connected.  
Type: Integer 

**TotalPauseDurationInSeconds**  
Total pause duration, including before and after the agent was connected.  
Type: Integer 

**TransferCompletedTimestamp**  
TransferCompleteTimestamp is populated when the agent (who initiated the transfer) disconnects before the new agent joining (cold transfer). If the agent who initiated the transfer does not disconnect before the new agent connected (warm transfer), TransferCompleteTimestamp is not populated on the initial agent's contact.  
Type: String (*yyyy*-*mm*-*dd*T*hh*:*mm*:*ss*Z)

**TransferredToEndpoint**  
If this contact was transferred out of Connect Customer, the transfer endpoint.  
Type: [Endpoint](#ctr-endpoint)

**Tags**  
[Tags](granular-billing.md) associated with the contact. This contains both AWS generated and user-defined tags.   
Type: String to string map

**GlobalResiliencyMetadata**  
Information about the global resiliency configuration for the contact, including traffic distribution details.  
Type: [GlobalResiliencyMetadata](#ctr-GlobalResiliencyMetadata)

## ContactLens
<a name="ctr-ContactLens"></a>

Conversational analytics information, if conversational analytics is enabled on the flow.

**ConversationalAnalytics**  
Information about the [conversational analytics](analyze-conversations.md) feature.   
An object that holds the conversational analytics behavior for the contact.  
Type: [ConversationalAnalytics](#ctr-ConversationalAnalytics)

## ConversationalAnalytics
<a name="ctr-ConversationalAnalytics"></a>

Information about [conversational analytics](analyze-conversations.md).

**Configuration**  
Configuration for conversational analytics for the contact.  
Type: [Configuration](#ctr-Configuration)

## Configuration
<a name="ctr-Configuration"></a>

Configuration for conversational analytics. You configure conversational analytics by using the [Set recording and analytics behavior](set-recording-behavior.md) flow block in the Connect Customer admin website, or by using the [UpdateContactRecordingBehavior](https://docs.aws.amazon.com/connect/latest/APIReference/contact-actions-updatecontactrecordingbehavior.html) contact action in the Flow language. 

**Enabled**  
Is conversational analytics enabled for the contact?  
Type: Boolean

**ChannelConfiguration**  
Channel-specific conversational analytics configuration for the contact. Conversational analytics configuration is mapped to the flow block that can process contacts from different channels. While majority of configuration parameters apply to all channels, this object contains a subset that are channel-specific.  
Type: [ChannelConfiguration](#ctr-ChannelConfiguration)

**LanguageLocale**  
Language locale used by conversational analytics to analyze the contact.  
Type: String

**RedactionConfiguration**  
Redaction configuration for the contact.  
Type: [RedactionConfiguration](#ctr-RedactionConfiguration)

**SentimentConfiguration**  
Sentiment configuration for the contact.  
Type: [SentimentConfiguration](#ctr-SentimentConfiguration)

## ChannelConfiguration
<a name="ctr-ChannelConfiguration"></a>

Channel configuration for the contact.

**AnalyticsModes**  
List of analytics modes for the contact.  
Type: [AnalyticsModes](#ctr-AnalyticsModes)

## Customer
<a name="ctr-Customer"></a>

Information about the person (customer) who contacts your contact center.

**Capabilities**  <a name="Capabilities-CTR"></a>
Information about customer’s capabilities.  
Type: [Capabilities](#ctr-Capabilities)

**DeviceInfo**  <a name="DeviceInfo-CTR"></a>
Information about customer's device.  
This field is populated only for in-app and web calling contacts, when the initiation method is `WEBRTC_API`. Otherwise, this field is not present, because PSTN voice and chat contacts don't include device information.  
Type: [DeviceInfo](#ctr-deviceinfo) 

## Capabilities
<a name="ctr-Capabilities"></a>

Information about the Video and ScreenShare capabilities.

**Video**  <a name="Video-CTR"></a>
Valid values: SEND.

**ScreenShare**  <a name="ScreenShare-CTR"></a>
Valid values: SEND.

## AnalyticsModes
<a name="ctr-AnalyticsModes"></a>

List of analytics modes for the contact. 

**AnalyticsModes**  
Analytics mode for the contact.  
Type: String  
Valid values for voice: `PostContact` \| `RealTime`  
Valid values for chat: `ContactLens`

## RedactionConfiguration
<a name="ctr-RedactionConfiguration"></a>

Redaction configuration for the contact.

**Behavior**  
Indicates whether redaction is enabled for sensitive data, such as personal information, in the conversational analytics output file and audio recording. When this field is set to `Disabled` all other values in this object are ignored.  
Type: String  
Valid values: `Enable` \| `Disable`

**Policy**  
Indicates whether you get both the redacted and the original transcripts and audio files, just the redacted transcripts and audio files, or only transcript with unredacted content. `None` indicates no redaction is applied.  
Type: String  
Valid values: `None` \| `RedactedOnly` \| `RedactedAndOriginal`

**Entities**  
List of redaction entities for the contact. If this is present, only entities mentioned in this list are redacted.  
Type: [Entities](#ctr-Entities)

**MaskMode**  
How sensitive information in a contact record should be masked.   
+ When `PII` is selected, all redacted entities are replaced with `[PII]` string. 
+ When `EntityType` is selected, all redacted entities are replaced with the label of the entity. For example, when `EMAIL` entity is configured for redaction, emails in the transcript are replaced by `[EMAIL]` string.
Type: String  
Valid values: `PII ` \| `EntityType` 

## SentimentConfiguration
<a name="ctr-SentimentConfiguration"></a>

Sentiment configuration for the contact.

**Behavior**  
Indicates whether sentiment analysis is enabled or disabled for contacts, default value is `Enable`.   
Type: String  
Valid values: `Enable` \| `Disable`

## Entities
<a name="ctr-Entities"></a>

List of redaction entities for the contact.

**Entity**  
Entities that should be redacted for the contact.  
Type: String  
Min value: 0

## SummaryConfiguration
<a name="ctr-SummaryConfiguration"></a>

Summary configurations for the contact.

**SummaryModes**  
List of summary modes for the contact.  
Type: [SummaryModes](#ctr-SummaryModes)  
Max value: 1

## SummaryModes
<a name="ctr-SummaryModes"></a>

List of summary modes for the contact. `PostContact` summary mode means [generative AI-powered post-contact summaries](view-generative-ai-contact-summaries.md) are enabled for the contact.

**SummaryMode**  
Summary mode for the contact.   
Type: String  
Valid values: `PostContact`

## DeviceInfo
<a name="ctr-deviceinfo"></a>

Information about participant's device. 

**PlatformName**  
Name of the platform that the participant used for the call.   
Type: String  
Length: 1-128

**PlatformVersion**  
Version of the platform that the participant used for the call.   
Type: String  
Length: 1-128

**OperatingSystem**  
Operating system that the participant used for the call.  
Type: String  
Length: 1-128

## DisconnectDetails
<a name="ctr-disconnectdetails"></a>

Information about the call disconnect experience. For information about how to use this data to troubleshoot call disconnects, see [Troubleshoot call disconnects by using DisconnectDetails in the contact record](troubleshoot-call-disconnects.md). 

**PotentialDisconnectIssue**  
Indicates the potential disconnection issues for a call. This field is not populated if the service does not detect potential issues.  
Type: String  
Length: 0-128  
Valid values:   
+ `AGENT_CONNECTIVITY_ISSUE`: Indicates potential issues with agent network connectivity.
+ `AGENT_DEVICE_ISSUE`: Indicates problems with the customer hearing the agent due to potential issues with the agent's device such as their workstation, headset, or microphone. 
+ `CUSTOMER_CONNECTIVITY_ISSUE`: Indicates potential issues with customer network connectivity.
+ `CUSTOMER_DEVICE_ISSUE`: Indicates problems with the customer hearing the agent due to potential issues with the customer's device such as their device speaker or microphone.

## Endpoint
<a name="ctr-endpoint"></a>

Information about an endpoint. In Connect Customer, an endpoint is the destination for a contact, such as a customer phone number, or a phone number for your contact center.

**Address**  
The value for the type of endpoint. For `TELEPHONE_NUMBER`, the value is a phone number in E.164 format.  
Type: String  
Length: 1-256

**Type**  
The endpoint type. Currently, an endpoint can only be a telephone number.  
Valid values: `TELEPHONE_NUMBER` 

## Expiry
<a name="ctr-Expiry"></a>

An object to specify the expiration of a routing step.

**DurationInSeconds**  
The number of seconds to wait before expiring the routing step.  
Type: Integer  
Min value: 1

**ExpiryTimestamp**  
The Timestamp indicating when the routing step expires.  
Type: String (yyyy-mm-ddThh:mm:ssZ)

## Expression
<a name="ctr-Expression"></a>

A tagged union to specify expression for a routing step.

**AndExpression**  
List of routing expressions which will be AND-ed together.  
Type: Expression  
Min value: 0

**OrExpression**  
List of routing expressions which will be OR-ed together.  
Type: Expression

**AttributeCondition**  
An object to specify the predefined attribute condition.  
Type: AttributeCondition

**NotAttributeCondition**  
An object to specify the predefined attribute condition to exclude agents with certain proficiencies.  
Type: AttributeCondition

## ExternalThirdParty
<a name="ctr-ExternalThirdParty"></a>

Information about the External Third Party participant.

**ExternalThirdPartyInteractionDuration**  
The time, in whole seconds, that the external participant interacted with the customer.  
Type: Integer  
Min value: 0

## GlobalResiliencyMetadata
<a name="ctr-GlobalResiliencyMetadata"></a>

Information about the global resiliency configuration for the contact, including traffic distribution details.

**ActiveRegion**  
The current AWS Region in which the contact is active. This indicates where the contact is being processed in real-time.  
Type: String  
Length Constraints: Minimum length of 0. Maximum length of 1024.

**OriginRegion**  
The AWS Region where the contact was originally created and initiated. This might differ from the `ActiveRegion` if the contact has been transferred across Regions.  
Type: String  
Length Constraints: Minimum length of 0. Maximum length of 1024.

**TrafficDistributionGroupId**  
The identifier of the traffic distribution group.  
Type: String  
Pattern: `^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$`

## ContactEvaluations
<a name="ctr-ContactEvaluations"></a>

Information about the contact evaluation.

**FormId**  
A unique identifier for the form. It is always present.  
Type: String

**EvaluationArn**  
The Amazon Resource Name for the evaluation form. It is always present.  
Type: String

**Status**  
The status of the evaluation.   
Type: String  
Valid values: `COMPLETE`, `IN_PROGRESS`, `DELETED`

**StartTimestamp**  
The date and time when the evaluation was started, in UTC time.   
Type: String (*yyyy-mm-dd*T*hh:mm:ss*Z)

**EndTimestamp**  
The date and time when the evaluation was submitted, in UTC time.   
Type: String (*yyyy-mm-dd*T*hh:mm:ss*Z)

**DeleteTimestamp**  
The date and time when the evaluation was deleted, in UTC time.   
Type: String (*yyyy-mm-dd*T*hh:mm:ss*Z)

**ExportLocation**  
The path where evaluation was exported.   
Type: String  
Length: 0-256

## MediaStream
<a name="MediaStream"></a>

Information about the media stream used during the contact.

**Type**  
Type: MediaStreamType  
Valid values: `AUDIO`, `CHAT`, `AUTOMATED_INTERACTION` 

## QualityMetrics
<a name="ctr-qualitymetrics"></a>

Information about the quality of participant's media connection when the participant is talking during the call.

**Agent**  
Information about the quality of agent media connection. This is a measure of how the agent sounded to the customer.  
Type: [AgentQualityMetrics](#ctr-agentqualitymetrics)

**Customer**  
Information about the quality of customer media connection. This is a measure of how the customer sounded to the agent.  
Type: [CustomerQualityMetrics](#ctr-customerqualitymetrics)

## AgentQualityMetrics
<a name="ctr-agentqualitymetrics"></a>

Information about the quality of the agent's media connection. This is a measure of how the agent sounded to the customer.

**Note**  
AgentQualityMetrics is available for voice calls only. 

**Audio**  
Information about the audio quality of the agent.  
Type: [AudioQualityMetricsInfo](#ctr-audioqualitymetrics)

## CustomerQualityMetrics
<a name="ctr-customerqualitymetrics"></a>

Information about the quality of the customer's media connection. This is a measure of how the customer sounded to the agent.

**Note**  
CustomerQualityMetrics is available for in-app and web voice calls only. For information about in-app and web calling, see [Set up in-app, web, video calling, and screen sharing capabilities](inapp-calling.md).

**Audio**  
Information about the audio quality of the Agent.  
Type: [AudioQualityMetricsInfo](#ctr-audioqualitymetrics)

## AudioQualityMetricsInfo
<a name="ctr-audioqualitymetrics"></a>

Information for quality score and potential quality issues for audio,

**QualityScore**  
Number representing the estimated quality of the media connection.  
Type: Number  
Min value: 1.00  
Max val: 5.00

** PotentialQualityIssues**  
List of potential issues causing degradation of quality on a media connection. If the service did not detect any potential quality issues the list is empty.  
Type: StringArray  
Valid values: Empty array or array with any of the following values: `HighPacketLoss`, `HighRoundTripTime`, `HighJitterBuffer`.

## QueueInfo
<a name="ctr-QueueInfo"></a>

Information about a queue.

**ARN**  
The Amazon Resource Name of the queue.  
Type: ARN

**DequeueTimestamp**  <a name="DequeueTimestamp-CTR"></a>
The date and time the contact was removed from the queue, in UTC time. Either the customer disconnected or the agent started interacting with the customer.  
Type: String (*yyyy*-*mm*-*dd*T*hh*:*mm*:*ss*Z)

**Duration**  <a name="Duration-CTR"></a>
The difference in time, in whole seconds, between `EnqueueTimestamp` and `DequeueTimestamp`.  
Type: Integer  
Min value: 0

**EnqueueTimestamp**  <a name="EnqueueTimestamp-CTR"></a>
The date and time the contact was added to the queue, in UTC time.  
Type: String (*yyyy*-*mm*-*dd*T*hh*:*mm*:*ss*Z)

**Name**  
The name of the queue.  
Type: String  
Length: 1-256

## RecordingInfo
<a name="ctr-RecordingInfo"></a>

Information about a voice recording.

**DeletionReason**  
If the recording was deleted, this is the reason entered for the deletion.  
Type: String

**Location**  
The location, in Amazon S3, for the recording.  
Type: String  
Length: 0-256

**Status**  
The recording status.  
Valid values: `AVAILABLE` \| `DELETED` \| `NULL` 

**Type**  
The recording type.  
Valid values: `AUDIO` 

## RecordingsInfo
<a name="ctr-RecordingsInfo"></a>

Information about a voice recording, chat transcript, or screen recording.

**DeletionReason**  
If the recording/transcript was deleted, this is the reason entered for the deletion.  
Type: String

**FragmentStartNumber**  
The number that identifies the Kinesis Video Streams fragment where the customer audio stream started.  
Type: String

**FragmentStopNumber**  
The number that identifies the Kinesis Video Streams fragment where the customer audio stream stopped.  
Type: String

**Location**  
The location of the recording or transcript. This is an Amazon S3 path when StorageType is S3, or a ARN when StorageType is KINESIS\_VIDEO\_STREAM.  
Type: String  
Length: 0-256

**MediaStreamType**  
Information about the media stream used during the conversation.   
Type: String  
Valid values: `AUDIO`, `VIDEO`, `CHAT`

**ParticipantType**  
Information about the conversation participant: whether they are an agent or contact. Following are the participant types:   
+ All
+ Manager
+ Agent
+ Customer
+ Thirdparty
+ Supervisor
+ IVR
Type: String

**StartTimestamp**  
When the conversation of the last leg of the recording started.  
Type: String *(yyyy-mm-ddThh:mm:ssZ)*

**Status**  
The status of the recording/transcript.  
Valid values: `AVAILABLE` \| `DELETED` \| `NULL` 

**StopTimestamp**  
When the conversation of the last leg of recording stopped.  
Type: String *(yyyy-mm-ddThh:mm:ssZ)*

**StorageType**  
Where the recording/transcript is stored.  
Type: String  
Valid values: Amazon S3 \| `KINESIS_VIDEO_STREAM` 

## References
<a name="ctr-contact-references"></a>

Contains links to other documents that are related to a contact.

**Reference Info**  
Name  
Type: `URL` \| `ATTACHMENT` \| `NUMBER` \| `STRING` \| `DATE` \| `EMAIL`  
+ When Type = `ATTACHMENT`, the record also has a Status field. 

  Status valid values: `APPROVED` \| `REJECTED` 
Value

## RoutingCriteria
<a name="ctr-RoutingCriteria"></a>

List of routing criteria. Each time the routing criteria is updated on a contact, it is added to this list.

**ActivationTimestamp**  
The Timestamp indicating when the routing criteria is set to active. A routing criteria is activated when the contact is transferred to a queue.  
ActivationTimestamp is set on routing criteria for contacts in agent queue even though Routing criteria is never activated for contacts in agent queue.  
Type: String (yyyy-mm-ddThh:mm:ssZ)

**Index**  
Information about the index of the routing criteria.  
When you have updated the routing criteria more than 3 times on an enqueued contact, then only the last 3 updates appear on the contact record. However, you can use the index to identify how many times the routing criteria were updated on the contact record.  
For example, if the routing criteria was updated 5 times, then you would see 3 routing criteria on the contact record with indices 2, 3, and 4. This is because at most only 3 routing criteria are stored on the contact record. The first two routing criteria updates that would have had indices 0 and 1 do not appear on the contact record.   
Type: Integer  
Min value: 0

**Steps**  
List of routing steps.  
Type: List of Step objects  
Length: 1-5

## RoutingProfile
<a name="ctr-RoutingProfile"></a>

Information about a routing profile.

**ARN**  
The Amazon Resource Name of the routing profile.  
Type: ARN

**Name**  
The name of the routing profile.  
Type: String  
Length: 1-100

## StateTransitions
<a name="ctr-StateTransitions"></a>

Information about the state transitions of a supervisor.

**stateStartTimestamp**  
The date and time when the state started in UTC time.  
Type: String (yyyy-mm-ddThh:mm:ssZ)

**stateEndTimestamp**  
The date and time when the state ended in UTC time.  
Type: String (yyyy-mm-ddThh:mm:ssZ)

**state**  
Valid values: `SILENT_MONITOR | BARGE`.

## Steps
<a name="ctr-Steps"></a>

When Connect Customer doesn't find an available agent who meet the requirements in a step for a given step duration, the routing criteria moves onto the next step sequentially until a join is completed with an agent. When all steps are exhausted, Connect Customer offers the contact to any agent in the queue. 

**Status**  
Represents status of the Routing step.  
Type: String  
Valid Values: EXPIRED, ACTIVE, JOINED, INACTIVE, DEACTIVATED, INTERRUPTED

**Expression**  
An object to specify the expression of a routing step..  
Type: Expression

**Expiry**  
An object to specify the expiration of a routing step.  
Type: Expiry

## VoiceIdResult
<a name="ctr-VoiceID"></a>

The latest Voice ID status.

**Authentication**  
The voice authentication information for the call.  
Type: Authentication

**FraudDetection**  
The fraud detection information for the call.  
Type: FraudDetection

**GeneratedSpeakerId**  
The speaker identifier generated by Voice ID.  
Type: String  
Length: 25 characters

**SpeakerEnrolled**  
Was the customer enrolled during this contact?  
Type: Boolean

**SpeakerOptedOut**  
Did the customer opt out during this contact?  
Type: Boolean

## WisdomInfo
<a name="ctr-wisdominfo"></a>

Information about an agent assist session.

**SessionArn**  
The Amazon Resource Name (ARN) of the agent assist session for the contact.  
Type: ARN

## Authentication
<a name="ctr-Authentication"></a>

Information about Voice ID authentication for a call.

**ScoreThreshold**  
The minimum authentication score required for a user to be authenticated.  
Type: Integer  
Min value: 0  
Max value: 100

**MinimumSpeechInSeconds**  
The number of seconds of speech used to authenticate the user.  
Type: Integer  
Min value: 5  
Max value: 10

**Score**  
The output of Voice ID authentication evaluation.  
Type: Integer  
Min value: 0  
Max value: 100

**Result**  
The string output of Voice ID authentication evaluation.  
Type: String  
Length: 1-32  
Valid values: `Authenticated` \| `Not Authenticated`\| `Not Enrolled` \| `Opted Out` \| `Inconclusive` \| `Error`

## FraudDetection
<a name="ctr-FraudDetection"></a>

Information about Voice ID fraud detection for a call.

**ScoreThreshold**  
The threshold for detection of fraudsters in a watchlist that was set in the flow for the contact.  
Type: Integer  
Min value: 0  
Max value: 100

**Result**  
The string output of detection of fraudsters in a watchlist.  
Type: String  
Valid values: `High Risk` \| `Low Risk` \| `Inconclusive` \| `Error`

**Reasons**  
Contains fraud types: Known Fraudster and Voice Spoofing.  
Type: List of String  
Length: 1-128

**RiskScoreKnownFraudster**  
The detection of fraudsters in a watchlist score for Known Fraudster category.  
Type: Integer  
Min value: 0  
Max value: 100

**RiskScoreVoiceSpoofing**  
The fraud risk score based on Voice Spoofing, such as playback of audio from Text-to-Speech systems recorded audio.  
Type: Integer  
Length: 3

**RiskScoreSyntheticSpeech (unused)**  
This field is unused. This score is presented as a combined risk score for Voice Spoofing.   
Type: Integer  
Length: 3

**GeneratedFraudsterID**  
The fraudster ID if the fraud type is Known Fraudster.  
Type: String  
Length: 25 characters

**WatchlistID**  
The fraudster watchlist that was set in the flow for the contact. Use for Known Fraudster Detection.  
Type: String  
Length: 22 characters

## How to identify abandoned contacts
<a name="abandoned-contact"></a>

An abandoned contact refers to a contact that was disconnected by the customer while in queue. This means that they weren't connected to an agent. 

The contact record for an abandoned contact has a **Queue**, and an **Enqueue Timestamp** because it was enqueued. It won't have a **ConnectedToAgentTimestamp**, or any of the other fields that populate only after the contact has been connected to an agent.