# Data model for Connect Customer contact records
<a name="ctr-data-model"></a>

This article describes the data model for Connect Customer contact records.

## Important things to know
<a name="important-things-to-know-ctr-data-model"></a>

* We continually release new features.

## Agent
<a name="ctr-Agent"></a>

Information about the agent who accepted the incoming contact.

**AgentInteractionDuration**  <a name="AgentInteractionDuration-CTR"></a>
The time, in whole seconds, that an agent interacted with a customer.   
This does not include agent pause duration (which applies only to tasks).  
Type: Integer  
Min value: 0

**ConnectedToAgentTimestamp**  
The date and time the contact was connected to the agent, in UTC time.  
Type: String (*yyyy*-*mm*-*dd*T*hh*:*mm*:*ss*Z)

## ContactTraceRecord
<a name="ctr-ContactTraceRecord"></a>

Information about a contact.

**Channel**  
How the contact reached your contact center.  
Valid values: `VOICE`, `CHAT`, `TASK`, `EMAIL`

**InitiationMethod**  
Indicates how the contact was initiated. For more information, see [Contact initiation methods](contact-initiation-methods.md).  
Valid values:  
+  `INBOUND`: The customer initiated voice (phone) contact with your contact center. 
+  `OUTBOUND`: An agent initiated voice (phone) contact with the customer.

**Note**  
This is a callout, not a field.

**Queue**  
If this contact was queued, this is information about the queue.  
Type: [QueueInfo](#ctr-QueueInfo)

## How to identify abandoned contacts
<a name="abandoned"></a>

**Abandoned**  
Not a field either.
