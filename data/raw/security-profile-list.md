

# List of security profile permissions in Connect Customer
<a name="security-profile-list"></a>

This topic is for administrators and contact center managers who assign and manage security profile permissions in Connect Customer. 

Security profile permissions allow users access to perform specific tasks in the Connect Customer admin website.

The following tables list: 
+ **UI name**: The name of the permission as it appears on the **Security profiles** page in Connect Customer.
+ **API name**: The name of the permission when it is returned by the [ListSecurityProfilePermissions](https://docs.aws.amazon.com/connect/latest/APIReference/API_ListSecurityProfilePermissions.html) API.

  For a list of all APIs that you can use manage security profile permissions, see [Security profile actions](https://docs.aws.amazon.com/connect/latest/APIReference/security-profiles-api.html).
+ **Use**: The functionality granted by the permission.

## Amazon Q
<a name="amazonq-permissions-list"></a>


| UI name | API name | Use | 
| --- | --- | --- | 
| AI agents | QConnectAIAgents.View<br />QConnectAIAgents.Edit<br />QConnectAIAgents.Create<br />QConnectAIAgents.Delete | [Create and manage AI agents](create-ai-agents.md). | 
| AI prompts | QConnectAIPrompts.View<br />QConnectAIPrompts.Edit<br />QConnectAIPrompts.Create<br />QConnectAIPrompts.Delete | [Create and manage AI prompts](create-ai-prompts.md). | 
| AI guardrails | QConnectGuardrails.View<br />QConnectGuardrails.Edit<br />QConnectGuardrails.Create<br />QConnectGuardrails.Delete | [Create and manage AI guardrails](create-ai-guardrails.md). | 

## Routing
<a name="routing-permissions-list"></a>


| UI name | API name | Use | 
| --- | --- | --- | 
| Routing profiles - Create | RoutingPolicies.Create | [Create routing profiles](routing-profiles.md). | 
| Routing profiles - Edit | RoutingPolicies.Edit | Edit routing profiles. | 
| Routing profiles - View | RoutingPolicies.View | View routing profiles. | 
| Quick connects - Create | TransferDestinations.Create | [Create quick connects](quick-connects.md). | 
| Quick connects - Delete | TransferDestinations.Delete | [Delete quick connects](quick-connects-delete.md). | 
| Quick connects - Edit | TransferDestinations.Edit | Edit quick connects. | 
| Quick connects - View | TransferDestinations.View | View quick connects. | 
| Hours of operation - Create | HoursOfOperation.Create | [Set hours of operation and timezone for a queue](set-hours-operation.md).  | 
| HoursOfOperation - Delete | HoursOfOperation.Delete | Delete hours of operation and timezone for a queue. | 
| HoursOfOperation - Edit | HoursOfOperation.Edit | Edit hours of operation and timezone for a queue. | 
| HoursOfOperation - View | HoursOfOperation.View | View hours of operation and timezone for a queue. | 
| Queues - Create | Queues.Create | [Create queues](create-queue.md). | 
| Queues - Edit | Queues.Edit | Edit information for a queue, such as name, description, and hours of operation. | 
| Queues - Enable / Disable | Queues.EnableAndDisable | [Enable and disable queues](disable-a-queue.md) to quickly control the flow of contacts to queues temporarily. | 
| Queues - View | Queues.View | View a list of queues in your Connect Customer instance. | 
| Task templates - Create | TaskTemplates.Create | [Create task templates](task-templates.md). | 
| Task templates - Delete | TaskTemplates.Delete | Delete task templates. | 
| Task templates - Edit | TaskTemplates.Edit | Edit task templates. | 
| Task templates - View | TaskTemplates.View | View task templates. | 
| Predefined attributes - View | PredefinedAttributes.View | View predefined attributes. | 
| Predefined attributes - Edit | PredefinedAttributes.Edit | Edit predefined attributes. | 
| Predefined attributes - Create | PredefinedAttributes.Create | [Create predefined attributes for routing contacts to agents](predefined-attributes.md).  | 
| Predefined attributes - Delete | PredefinedAttributes.Delete | Delete predefined attributes. | 
| Data tables - Create | DataTables.Create | [Create and configure data tables](data-tables.md). | 
| Data tables - Delete | DataTables.Delete | Delete data tables. | 
| Data tables - Edit | DataTables.Edit | Edit metadata and values for data tables. | 
| Data tables - View | DataTables.View | View data tables. | 
| Data tables - Manage values | DataTables.ManageValues | Manage data table values. | 
| Data tables - Edit expressions | DataTables.EditExpressionValues | Edit data table value expressions. | 

## Channels and flows
<a name="numbers-flows-permissions-list"></a>


| UI name | API name | Use | 
| --- | --- | --- | 
| Prompts - Create | Prompts.Create | [Create prompts](prompts.md). | 
| Prompts - Delete | Prompts.Delete | Delete prompts. | 
| Prompts - Edit | Prompts.Edit | Edit prompts. | 
| Prompts - View | Prompts.View | View a list of available prompts. | 
| Flows - Create | ContactFlows.Create | [Create flows](create-contact-flow.md). | 
| Flows - Remove | ContactFlows.Delete | [Delete flows](delete-contact-flow.md). | 
| Flows - Edit | ContactFlows.Edit | Edit flows. | 
| Flows - Publish | ContactFlows.Publish | Publish flows. | 
| Flows - View | ContactFlows.View | View flows. | 
| Flow modules - Create | ContactFlowModules.Create | [Create flow modules for reusable functions](contact-flow-modules.md).  | 
| Flow modules - Remove | ContactFlowModules.Delete | Delete flow modules. | 
| Flow modules - Edit | ContactFlowModules.Edit | Edit flow modules. | 
| Flow modules - Publish | ContactFlowModules.Publish | Publish flow modules. | 
| Flow modules - View | ContactFlowModules.View | View flow modules. | 
| Bots | Bots.Create | [Create a bot by using the Connect Customer admin website](work-bot-building-experience.md). | 
| Bots | Bots.View<br />Bots.Edit | [Evaluate the performance of your conversational AI bot in Connect Customer](lex-bot-analytics.md).  | 
| Bots | Bots.Delete | Remove a bot. | 
| Phone numbers - Claim | PhoneNumbers.Claim | [Claim phone numbers](get-connect-number.md). | 
| Phone numbers - Edit | PhoneNumbers.Edit | Edit phone numbers. [Attach a claimed or ported phone number to a flow in Connect Customer](associate-claimed-ported-phone-number-to-flow.md).  | 
| Phone numbers - Release | PhoneNumbers.Release | [Release phone numbers back to inventory](release-phone-number.md). | 
| Phone numbers - View | PhoneNumbers.View | View a list of phone numbers that have been claimed or ported to your Connect Customer instance. | 
| Communication widget - Enable/Disable | ChatTestMode | Access a simulated web page so users can [test the chat experience](chat-testing.md#test-chat). Also grant users the **Contactflow.View** permission so they can view and choose from a list of available flows in the **Test settings** option. | 
| Email addresses |  | View | 
| Email addresses |  | Edit | 
| Email addresses |  | Create | 
| Email addresses |  | Remove | 
| Views - View | Views.View | Allow access to [Views](view-resources-sg.md). | 
| Views - Edit | Views.Edit | Allow access to edit [Views](view-resources-sg.md). | 
| Views - Create | Views.Create | Create custom [view](view-resources-custom-view.md) resources. | 
| Views - Remove | Views.Remove | Remove View resources.  | 
| AnalyticsConnectors -Edit | AnalyticsConnectors.Edit | [Edit existing analytics connectors](contact-lens-integration.md). | 
| AnalyticsConnectors - View  | AnalyticsConnectors.View | [View existing analytics connectors](contact-lens-integration.md). | 

## Users and permissions
<a name="users-permissions-list"></a>


| UI name | API name | Use | 
| --- | --- | --- | 
| Users - Create | Users.Create | [Add users to Connect Customer](user-management.md). We recommend you limit who has these permissions. They pose a risk to your contact center because they can do the following:+  Reset passwords, including that of the administrator.  <br />+  Grant other users permission to the Admin security profile. People assigned to the Admin security profile have full access to your contact center. <br />Doing these things would enable someone to lock out those who need to access Connect Customer, and allow in others who can steal customer data and damage your business. <br />You can limit this risk by adding [tag-based access control](tag-based-access-control.md) on the security profile. For example, you can apply tag-based access control to deny access to administrators and the Admin security profile.  | 
| Users - Delete | Users.Delete | [Delete users from Connect Customer](delete-users.md). | 
| Users - Edit | Users.Edit | View and edit all user identity information *except* for security profiles. As with **Users - Create**, limit who has these permissions because they pose a risk to your contact center. | 
| Users - Edit permission | Users.EditPermission | View and edit user security profiles. As with **Users - Create**, limit who has these permissions because they pose a risk to your contact center. | 
| Users - View | Users.View | View user records. [Download or export a list of users](download-user-records.md) from your Connect Customer instance to a CSV file. | 
| Agent hierarchy - Create | AgentGrouping.Create | [Create agent hierarchies](agent-hierarchy.md). Add groups, teams, and agents. | 
| Agent hierarchy - Edit | AgentGrouping.Edit | Edit agent hierarchies and the hierarchy level structure.  | 
| Agent hierarchy - Enable/Disable | AgentGrouping.EnableAndDisable | View or edit agent hierarchy information. | 
| Agent hierarchy - View | AgentGrouping.View | View the agent's hierarchy information in a real-time metrics report, which can include their location and skill set data. | 
| Security profiles - Create | SecurityProfiles.Create | [Create security profiles](create-security-profile.md). | 
| Security profiles - Delete | SecurityProfiles.Delete | Delete security profiles. | 
| Security profiles - Edit | SecurityProfiles.Edit | [Update security profiles](update-security-profiles.md). | 
| Security profiles - View | SecurityProfiles.View | View security profiles. | 
| Agent status - Create | AgentStates.Create | [Create an custom agent status](agent-custom.md). The status appears in the Contact Control Panel (CCP), such as Break, Lunch, or Training.  | 
| Agent status - Edit | AgentStates.Edit | Edit a custom agent status. | 
| Agent status - Enable/Disable | AgentStates.EnableAndDisable | View and edit custom agent states. | 
| Agent status - View | AgentStates.View | [View an agent's status in the real-time metrics report](rtm-change-agent-activity-state.md) and historical metrics report. For example, if they are **Available**, **Offline**, or in a custom state. View their status in the [Agent activity report](agent-activity-audit-report.md). | 
| Workspaces - Create | Workspaces.Create | [Set up workspaces for your business users](amazon-connect-workspaces.md). | 
| Workspaces - Delete | Workspaces.Delete | Delete workspaces. | 
| Workspaces - Edit | Workspaces.Edit | Edit workspaces. | 
| Workspaces - View | Workspaces.View | View workspaces. | 
| Workspaces - Assign | Workspaces.Assign | Assign workspaces to users and routing profiles. | 
| Workspaces - Edit visibility | Workspaces.EditVisibility | Edit workspaces to be visible to all users, no users, or based on assignments. | 

## Contact Control Panel (CCP)
<a name="ccp-permissions-list"></a>


| UI name | API name | Use | 
| --- | --- | --- | 
| Access Contact Control Panel | BasicAgentAccess | Manages access to the Contact Control Panel (CCP). Assign this permission to agents as well as managers who need to monitor live conversations. | 
| Conversational analytics data | RealtimeContactLens.View | Enables users to view real-time analytics provided by conversational analytics. | 
| Make outbound calls | OutboundCallAccess | Grants users permissions to make outbound calls. For more information about setting up outbound calling, see [Set up outbound calling in Connect Customer](outbound-communications.md). | 
| Voice ID | VoiceId.Access | Enables controls in the Contact Control Panel so agents can:+  View authentication outcomes. <br />+  Opt-out or re-authenticate a caller. <br />+  Update `SpeakerID`. <br />+  View fraud detection results, rerun fraud analysis (fraud detection decision, fraud type and score).  | 
| Restrict task creation | RestrictTaskCreation.Access | Block agents from being able to create tasks.  | 
| Restrict phone type settings | RestrictPhoneTypeSettings.Access | Block agents from changing their phone type (softphone or deskphone) in the Contact Control Panel.  | 
| Audio device settings | AudioDeviceSettings.Access | [Choose your preferred device for speaker, microphone, and ringer in the Contact Control Panel (CCP) or agent workspace](audio-device-settings.md).  | 
| Video calls | VideoContact.Access | [Enable agents to use video calling and screen sharing](config-com-widget1.md#agent-cx-cw).  | 
| Initiate email conversation | OutboundEmail.Create | Allows agents to initiate an outbound email from the Contact Control Panel / agent workspace without first receiving an email contact from a customer. Allows agents to forward email contacts to external email addresses or distribution lists. Allows agents to reply to closed email contacts. | 
| Allow self assigning of contacts | SelfAssignContacts.Access | To self assign tasks, agents also need to have the **Restrict Task Creation** permission disabled and have tasks enabled as a channel within their assigned routing profile.  | 
| Confirmation before ending contact | RequireEndContactConfirmation.Enabled | Requires agents to confirm before ending a contact. When enabled, agents see a confirmation dialog when they choose the **End** button for voice calls, chats, emails, and tasks. | 

## Analytics and Optimization
<a name="analytics-list"></a>


| UI name | API name | Use | 
| --- | --- | --- | 
| Access metrics | AccessMetrics | [Assign permissions to view dashboards and reports](dashboard-required-permissions.md). | 
| Real-time metrics | AccessMetrics.RealTimeMetrics.Access | Manage access to the real-time metrics page. | 
| Historical metrics | AccessMetrics.HistoricalMetrics.Access | Manage access to the historical metrics page. | 
| Agent activity audit | AccessMetrics.AgentActivityAudit.Access | Manage access to the agent activity audit within the historical metrics page. | 
| Dashboards | AccessMetrics.Dashboards.Access | [Dashboards in Connect Customer for getting contact center performance data](dashboards.md) | 
| View my own data in dashboards - View | AccessMetrics.DashboardsWithMyData.View |  Grants access to the Dashboards to view individual agent performance metrics and the metrics of queues in the agent's routing profile. For more information, see [Agent workspace performance dashboard](performance-dashboard-aw.md).  | 
| Custom metrics | CustomMetrics.Create<br />CustomMetrics.View<br />CustomMetrics.Edit<br />CustomMetrics.Delete<br />CustomMetrics.Publish |  Grants access to [create and manage custom service level metric calculations](dashboard-customize-widgets.md#dashboard-custom-sl) for any widget on a dashboard. | 
| Contact Search | ContactSearch.View | Access the **Contact search** page, which is where users can [search for contacts](contact-search.md) and see results on the **Contact details** page. | 
| View my contacts | MyContacts.View | Allows agents to view contacts that they themselves had handled, on **Contact search** and **Contact details** pages. | 
| Sample contacts | ContactSearchSampleContacts.View | Find a [random sample of contacts](random-sampling-of-contacts-for-evaluation.md) for evaluating agent performance and contact quality, for example, 5 contacts per agent from last month. | 
| Search contacts by conversation characteristics | ContactSearchWithCharacteristics.Access | Access to the conversational analytics filters that enable users to search by sentiment scores, non-talk time, and category. | 
| Search contacts by conversation characteristics - View | ContactSearchWithCharacteristics.View | View the conversational analytics filters that enable users to search by sentiment scores, non-talk time, and category.  | 
| Search contacts by keywords | ContactSearchWithKeywords.Access | Search for contacts by keyword. On the **Contact Search** page, users can access additional filters that allow them to search conversational analytics transcripts by keywords or phrases, such as "thank you for your business." | 
| Search contacts by keywords - View | ContactSearchWithKeywords.View | Search for contacts by keyword. On the **Contact Search** page, users can access additional filters that allow them to search conversational analytics transcripts by keywords or phrases, such as "thank you for your business." | 
| Configure searchable contact attributes - View | ConfigureContactAttributes.View | Determine what custom attribute data will be searchable (by people who have the **Contact attributes** permission). It allows them to access the **Searchable custom contact attributes** page. For more information, see [Search for contacts in Connect Customer by using custom contact attributes or contact segment attributes](search-custom-attributes.md). | 
| Restrict contact access | RestrictContactAccessByHierarchy.View | Manage a user's access to results on the **Contact search** page based on their agent hierarchy group. For more information, see [Manage who can search for contacts and access detailed information](contact-search.md#required-permissions-search-contacts). | 
| Contact attributes | ContactAttributes.View | View contact attributes. Also controls access to the search filters based on contact attributes. For more information, see [Search for contacts in Connect Customer by using custom contact attributes or contact segment attributes](search-custom-attributes.md). | 
| Conversational analytics - View | GraphTrends.View | On the **Contact details** page for a contact, users can view conversational analytics outputs such as graphs (on sentiment, talk time, and other various outputs), sentiment indicators, and contact category labels on conversation recordings and transcripts.<br />Users can view data on the [Connect Customer conversational analytics dashboard](contact-lens-conversational-analytics-dashboard.md). | 
| Information extraction – definitions | InformationExtraction.Definitions.Create<br />InformationExtraction.Definitions.View<br />InformationExtraction.Definitions.Edit<br />InformationExtraction.Definitions.Delete | Create and manage [information extraction definitions](information-extraction-configure.md). | 
| Information extraction - results - View | InformationExtraction.Results.View | View [extracted information](information-extraction-view.md) on the Contact details page and in the CCP. | 
| Conversational analytics - post-contact summary | ContactLensPostContactSummary.View | View post-contact summarization powered by generative artificial intelligence (generative AI) on the Contact Search and Contact Details pages. | 
| Conversational analytics - custom vocabularies - Edit | ContactLensCustomVocabulary.Edit | [Add custom vocabularies](add-custom-vocabulary.md).  | 
| Conversational analytics - custom vocabularies - View | ContactLensCustomVocabulary.View | [Download and view custom vocabularies](add-custom-vocabulary.md#view-custom-vocabulary). | 
| Conversational analytics - theme detection - Create | ThemeDetection.Create | [Create theme detection reports on the **Contact search** page](use-theme-detection.md). | 
| Conversational analytics - theme detection - View | ThemeDetection.View | View theme detection reports on the **Contact search** page.  | 
| Conversational analytics - theme detection - Delete | ThemeDetection.Delete | Delete theme detection reports on the **Contact search** page.  | 
| Rules - Create | Rules.Create | [Create rules](connect-rules.md).  | 
| Rules - Delete | Rules.Delete | Delete rules.  | 
| Rules - Edit | Rules.Edit | Edit rules.  | 
| Rules - Generative AI | RulesGenerativeAI.Create<br />RulesGenerativeAI.View<br />RulesGenerativeAI.Edit<br />RulesGenerativeAI.Delete | Manage rules that use generative AI. To create generative AI-powered rules, you additionally need the **Rules** permission.  | 
| Rules - View | Rules.View | View rules.  | 
| Login/Logout report - View | AgentTimeCard.View |  [View Login/Logout reports](login-logout-reports.md).  | 
| Real-time contact monitoring- Enable/Disable | ManagerListenIn | [Monitor live conversations](monitor-conversations.md) and [listen to recordings of past conversations](review-recorded-conversations.md). Be sure to assign managers to the Agent security profile so they can access the Contact Control Panel (CCP). This enables them to monitor the conversation through the CCP. | 
| Real-time contact barge-in - Enable/Disable | ManagerBargeIn | Enables supervisors and managers to barge into live conversations between agents and customers. To learn more about Barge for live conversations, see [Barge into live voice and chat conversations between contact center agents and customers](monitor-barge.md). | 
| Saved reports - View | MetricsReports.View | [View a shared report](view-a-shared-report.md). | 
| Saved reports - Create | MetricsReports.Create<br />MetricsReports.Share | [Create and share reports](share-reports.md). | 
| Saved reports - Edit | MetricsReports.Edit | Edit saved reports. | 
| Saved reports - Delete | MetricsReports.Delete | Delete saved reports. | 
| Saved reports - Publish | MetricsReports.Publish | [Publish reports](publish-reports.md) and [share reports](share-reports.md). | 
| Saved reports - Schedule | MetricsReports.Schedule<br />MetricsReports.Publish<br />ReportSchedules.Create<br />ReportSchedules.Delete<br />ReportSchedules.Edit<br />ReportSchedules.View | [Schedule a saved report](schedule-historical-metrics-report.md). By default, they get permission to create, delete, edit, and view a saved report. | 
| Saved reports (admin) | ReportsAdmin.View <br />ReportsAdmin.Delete  | [View and delete all saved reports in your instance, including those not created by you](manage-saved-reports-admin.md). | 
| Evaluation forms - perform evaluations |  Evaluation.Create<br />Evaluation.View<br /> Evaluation.Edit<br />Evaluation.Delete | [Evaluate performance](evaluations.md).  | 
| Evaluation forms - view my received evaluations | MyReceivedEvaluations.View | User can [search and view completed evaluations](search-evaluations.md) they have received.  | 
| Evaluation forms - manage form definitions |  EvaluationForms.Create<br />EvaluationForms.View<br /> EvaluationForms.Edit<br />EvaluationForms.Delete | [Create and manage evaluation forms](create-evaluation-forms.md).  | 
| Evaluation forms - ask AI assistant | EvaluationAssistant.Access | Access the **Ask AI** button while performing evaluations, enabling you to get generative AI-powered recommendations for answers to questions in evaluation forms. | 
| Evaluation forms - manage calibration sessions  | EvaluationCalibrationSessions.Create<br />EvaluationCalibrationSessions.Delete<br />EvaluationCalibrationSessions.Edit<br />EvaluationCalibrationSessions.View | Create and manage calibration sessions to drive consistency and accuracy in how managers evaluate agent performance. | 
| Coaching - my coaching sessions - View | MyCoachingSessions.View | View [coaching sessions](provide-coaching.md) where you are the coach or the participant. If you are the participant, you can acknowledge the coaching session with this permission. | 
| Coaching - my coaching sessions - Create, Edit, Delete | MyCoachingSessions.Create<br />MyCoachingSessions.Delete<br />MyCoachingSessions.Edit | Create, edit or delete coaching sessions with yourself as the coach. | 
| Coaching - manage coaching sessions | CoachingSessions.Create<br />CoachingSessions.Delete<br />CoachingSessions.Edit<br />CoachingSessions.View | Access coaching sessions performed by yourself or others. With this permission, you can [create coaching](provide-coaching.md) with yourself or others as the coach. | 
| Evaluation forms - review evaluations - Create | EvaluationReviews.Create | Perform evaluation reviews. | 
| Evaluation forms - review evaluations - View | EvaluationReviews.View | View evaluation review drafts before they are finalized. | 
| Evaluation forms - request evaluation reviews | EvaluationReviewRequest.View<br />EvaluationReviewRequest.Create<br />EvaluationReviewRequest.Delete | [Request evaluation reviews](evaluation-review-requests.md) if the evaluation form has review requests enabled. | 
| Voice ID - attributes and search | VoiceIdAttributesAndSearch.View | Search for and view Voice ID results on the **Contact detail** page. | 
| Forecasting - View | Forecasting.View | [Review contact volume and average handle time forecasts](inspect-forecast.md). | 
| Forecasting - Edit | Forecasting.Edit |  [Create and edit contact volume and average handle time forecasts](create-forecasts.md).  | 
| Forecasting - Publish | Forecasting.Publish | [Publish a forecast in Connect Customer](publish-forecast.md). | 
| Capacity planning - View | Capacity.View | [Review capacity plan output in Connect Customer](capacity-planning-review-output.md). | 
| Capacity planning - Edit | Capacity.Edit | [Create capacity planning scenarios in Connect Customer](capacity-planning-create-scenarios.md). | 
| Capacity planning - Publish | Capacity.Publish | [Publish a capacity plan in Connect Customer](publish-capacity-plan.md). | 
| Forecast and schedule interval - Edit and View | ForecastScheduleInterval.Edit <br />ForecastScheduleInterval.View |  [Set the forecast and schedule interval in Connect Customer](set-forecast-scheduling-interval.md).  | 

## Recordings and Transcripts
<a name="recordings-and-transcripts-list"></a>


| UI name | API name | Use | 
| --- | --- | --- | 
| Call recordings (unredacted) - Access | CallRecordings.Unredacted.Access | On the **Contact details** and **Contact search** pages for a contact, view unredacted audio recordings.<br />If you have BOTH **Call recordings (unredacted) - Access** and **Call recordings (redacted) - Access** permissions: +  If redaction is enabled on the flow, then redacted content is displayed on the **Contact details** and **Contact search** pages. <br />+  If redaction is disabled on the flow or the contact is not analyzed by conversational analytics, then unredacted content is displayed on the **Contact details** and **Contact search** pages. <br />You cannot access both the redacted and unredacted version of a conversation at the same time. | 
| Call recordings (redacted) - Access | CallRecordings.Redacted.Access | On the **Contact details** and **Contact search** pages for a contact, listen to call recordings in which the sensitive data has been redacted. | 
| Contact transcripts (unredacted) - Access | ContactTranscripts.Unredacted.Access | On the **Contact details** and **Contact search** pages for a contact, view unredacted chat and email conversations, and unredacted voice transcripts produced by conversational analytics.<br />If you have BOTH **Contact transcripts (unredacted) - Access** and **Contact transcripts (redacted) - Access** permissions:+  If redaction is enabled on the flow, then redacted content is displayed on the **Contact details** and **Contact search** pages. <br />+  If redaction is disabled on the flow or the contact is not analyzed by conversational analytics, then unredacted content is displayed on the **Contact details** and **Contact search** pages. <br />You cannot access both the redacted and unredacted version of a conversation at the same time. | 
| Contact transcripts (redacted) - Access | ContactTranscripts.Redacted.Access | On the **Contact details** and **Contact search** pages for a contact, view chat and voice transcripts in which the sensitive data has been redacted. | 
| Call recordings (unredacted) - Enable download button | CallRecordings.Unredacted.DownloadButton | Enables buttons to download call recordings when user is viewing the unredacted recording on the **Contact Search** and **Contact Details** pages. The **Enable download button** permission is selected by default when you select **Call recordings (unredacted)** permission, so they can [download call recordings](download-recordings.md) through the Connect Customer admin website. This permission only controls the ability to view the download button. They might still be able to download the contact recording without this permission if they have the **Call recordings (unredacted) - Access** permission.  | 
| Call recordings (redacted) - Enable download button | CallRecordings.Redacted.DownloadButton | Enables buttons to download call recordings when user is viewing the redacted recording on the **Contact Search** and **Contact Details** pages. The **Enable download button** permission is selected by default when you select **Call recordings (redacted)** permission, so they can [download call recordings](download-recordings.md) through the Connect Customer admin website. This permission only controls the ability to view the download button. They might still be able to download the contact recording without this permission if they have the **Call recordings (redacted) - Access** permission.  | 
| Contact transcripts (unredacted) - Enable download button | ContactTranscripts.Unredacted.DownloadButton | Enables buttons to download contact transcripts when user is viewing the unredacted transcript on the **Contact Search** and **Contact Details** pages. The **Enable download button** permission is selected by default when you select **Contact transcripts (unredacted)** permission so they can [download call recordings](download-recordings.md) through the Connect Customer admin website. This permission only controls the ability to view the download button. They might still be able to download the contact transcript without this permission if they have the **Contact transcript (unredacted) - Access** permission. <br />A button appears on the **Contact Search** and **Contact Details** pages to download unredacted transcripts for chat and email. | 
| Delete recorded conversations | DeleteCallRecordings | Delete call recordings and contact transcripts | 
| Screen recording - Access | ScreenRecording.Access | Access the screen recording media player and view videos on the Contact details page. If rule-based redaction is not enabled, screen recording merges the screen recording video with the unredacted call recording file. If users have permission to view screen recordings, they can listen to the unredacted audio. <br />To overcome this, you can enable [rule-based redaction](rule-based-redaction-screen-recording.md) which merges the screen recording video with the redacted call recording (if enabled). You will have to update the permissions to choose which users get access to redacted and unredacted screen recording.  | 
| Screen recording (redacted) - Access | ScreenRecording.Redacted.Access | Open the contact detail page media player and view redacted screen recordings produced by [rule-based redaction](rule-based-redaction-screen-recording.md). | 
| Screen recording (redacted) - Enable download button | ScreenRecording.Redacted.Download | Download redacted screen recordings from the Contact details page. Requires the **Screen recording (redacted) - Access** permission. | 
| Automated interaction voice (IVR) recordings (unredacted) - Access | AutomatedVoiceInteraction.Recordings.Unredacted.Access | Access voice recordings of automated interactions (with IVR, Amazon Lex or other bots).<br />View the Play icon so users can listen to prompts while reviewing the automated interaction logs on the Connect Customer admin website. | 
| Automated interaction voice (IVR) recordings (unredacted) - Enable download button | AutomatedVoiceInteraction.Recordings.Unredacted.DownloadButton | Enables buttons to download call recordings. The **Enable download button** permission is selected by default when you select the **Automated interaction voice (IVR) recordings** permission so they can [download call recordings](download-recordings.md) through the Connect Customer admin website.<br />To perform a download, however, they need the **Automated interaction voice (IVR) recordings (unredacted) - Access** permission. | 
| Automated interaction voice (IVR) transcripts (unredacted) | AutomatedVoiceInteraction.Transcripts.Unredacted.Access | Access human-readable logs of the IVR interaction including keypad inputs in response to IVR prompts, transcripts of Amazon Lex interactions, and more, on the **Contact details** and **Contact search** pages. | 

## Legacy permissions
<a name="legacy-permissions"></a>

The following table lists legacy permissions. You can not access these permissions through the Security Profiles page. 

 Existing security profiles that have these permissions will continue to work. However, note the following functionality: 
+  When you edit a security profile that contains legacy permissions, Connect Customer automatically migrates the legacy permissions to the new corresponding permissions when you choose **Save** on the **Security Profiles** page. 
+ You can still add legacy permissions to security profiles by using the [CreateSecurityProfile](https://docs.aws.amazon.com/connect/latest/APIReference/API_CreateSecurityProfile.html) and [UpdateSecurityProfile](https://docs.aws.amazon.com/connect/latest/APIReference/API_UpdateSecurityProfile.html) APIs.


| UI name | API name | Use | 
| --- | --- | --- | 
| Recorded conversations (redacted) - View | RedactedData.View | On the **Contact Details** and **Contact Search** pages for a contact, listen to call recording files and view call transcripts in which the sensitive data has been removed. If you edit a security profile containing the **Recorded conversations (redacted) - View** permission, it will automatically be migrated to contain the new corresponding permissions (**Call recordings (redacted) - Access** and **Contact transcripts (redacted) - Access**) when you choose **Save** on the **Security Profiles** page. <br />To grant access to redacted recorded conversations:+  Use the **Call recordings (redacted) - Access** permission for redacted call recordings <br />+  Use the **Contact transcripts (redacted) - Access** permission for redacted contact transcripts <br />You can access both newly migrated permissions in the **Recordings and Transcripts** section of the **Security Profiles** page. | 
| Recorded conversations (unredacted) - View | ListenCallRecordings | On the **Contact details** and **Contact search** pages for a contact, view unredacted content that contains sensitive data, such as name and credit card information.+  Unredacted chat and email conversations <br />+  Unredacted voice transcripts produced by conversational analytics <br />+  Unredacted voice recordings  If you edit a security profile containing the **Recorded conversations (unredacted) - View** permission, it will automatically be migrated to contain the new corresponding permissions (**Call recordings (unredacted) - Access** and **Contact transcripts (unredacted) - Access**) when you choose **Save** on the **Security Profiles** page. <br />To grant access to unredacted recorded conversations:+  Use the **Call recordings (unredacted) - Access** permission for unredacted call recordings <br />+  Use the **Contact transcripts (unredacted) - Access** permission for unredacted contact transcripts <br />You can access both newly migrated permissions in the **Recordings and Transcripts** section on the **Security Profiles** page.<br />If you have both **Recorded conversations (redacted) - Access** and **Recorded conversations (unredacted) - Access** permissions, then:+  If redaction is enabled on the flow, the redacted content is displayed on the **Contact details** and **Contact search** pages. <br />+  If redaction is disabled on the flow or the contact is not analyzed by conversational analytics, the unredacted content is displayed on the **Contact details** and **Contact search** pages. <br />You cannot access both the redacted and unredacted version of a conversation at the same time. | 
| Recorded conversations - Enable download button | DownloadCallRecordings | Enables buttons on the Connect Customer admin website to download call recordings. By default, the **Enable download button** permission is granted so they can [download call recordings](download-recordings.md) through the Connect Customer admin website. To perform a download, however, they need permissions to access a **Recorded conversation (unredacted)**. If you edit a security profile that contains the **Recorded conversations (unredacted) - Enable download button** permission, it is automatically migrated to contain the new corresponding permissions (**Call recordings (unredacted) - Enable download button**, **Call recordings (redacted) - Enable download button**, and **Contact transcripts (unredacted) - Enable download button**) when you choose **Save** on the **Security Profiles** page. <br />To enable the download button for recorded conversations:+  Use the **Call recordings (unredacted) - Enable download button** permission for unredacted call recordings. <br />+  Use the **Call recordings (redacted) - Enable download button** permission for redacted call recordings. <br />+  Use the **Contact transcripts (unredacted) - Enable download button** permission for unredacted contact transcripts. <br />All newly migrated permissions are located in the **Recordings and Transcripts** section on the **Security Profiles** page. | 

## Contact Actions
<a name="contactactions-sp"></a>


| UI name | API name | Use | 
| --- | --- | --- | 
| Allow 'Assign to Me' for any contact | ManualAssignAnyContact.Enable | This permission allows an Agent to View and manually assign any Contacts that are part of the Manual Assignment Queue.  | 
| Allow 'Assign to Me' for my contacts | ManualAssignMyContacts.Enable | This permission allows an Agent to View and manually assign any contacts that are part of the Manual Assignment Queue and the Agent is one of the Preferred Agents on the Contact. | 
| Transfer Contact | TransferContact.Enabled | [Transfer contacts on Analytics and optimization pages](transfer-contacts-admin.md). Currently transfer of task contacts to quick connects is supported on the **Contact details** page. | 
| End contact | StopContact.Enabled | [End contacts on Analytics and optimization pages](end-contacts-admin.md). Currently supported on the **Contact details** page. | 
| Reschedule contact | UpdateContactSchedule.Enabled | [Reschedule previously scheduled contact on Analytics and optimization pages](reschedule-contacts-admin.md). Currently supported on the **Contact details** page for task contacts only. | 
| Update contact tags | Contacts.Tag.Edit | Add and remove tags from contacts on the **Contact details** page. For more information, see [Tag contacts on the Contact details page in Connect Customer](tag-contacts-admin.md). | 

## Historical changes
<a name="historical-changes-list"></a>


| UI name | API name | Use | 
| --- | --- | --- | 
| View historical changes | HistoricalChanges.View | View historical changes on all Connect Customer admin website pages that support historical changes. | 

## Customer Profiles
<a name="customerprofiles-permissions-list"></a>


| UI name | API name | Use | 
| --- | --- | --- | 
| Customer profiles - Create | CustomerProfiles.Create | [Create customer profiles in the agent workspace](ag-cp-create.md). | 
| Customer profiles - Edit | CustomerProfiles.Edit | Edit customer profiles in the agent workspace. | 
| Customer profiles - View | CustomerProfiles.View | View customer profiles in the agent workspace. | 
| Calculated Attributes - Create | CustomerProfiles.CalculatedAttributes.Create | [Create calculated attributes](calculated-attributes-admin-website-create.md).  | 
| Calculated Attributes - Edit | CustomerProfiles.CalculatedAttributes.Edit | [Edit calculated attributes](calculated-attributes-admin-website-edit.md).  | 
| Calculated Attributes - Delete | CustomerProfiles.CalculatedAttributes.Delete | [Delete calculated attributes](calculated-attributes-admin-website-delete.md).  | 
| Calculated Attributes - View | CustomerProfiles.CalculatedAttributes.View | [View calculated attributes](calculated-attributes-admin-website-view.md). | 
| Customer segments - View | CustomerProfiles.Segments.View | View all customer created segments. You can see segment details, the definitions that were created, and segment estimate counts. | 
| Customer segments - Create | CustomerProfiles.Segments.Create | Create segment definitions based on all profile attributes on a Customer Profiles domain associated with this instance. `Create` permissions allow creating definitions based on existing profile attributes and their values. You can also use default and created calculated attributes in the segment definition.  | 
| Customer segments - Delete | CustomerProfiles.Segments.Delete | With `Delete` permissions, you can delete your Segment Definition. | 
| Customer segments - Export | CustomerProfiles.Segments.Export | With Export, you can create an exported CSV of all the profile data from profiles in that segment. You can also use it to view underlying profile data once exported. | 
| Profile explorer - View | CustomerProfiles.ProfileExplorer.View | View the profile explorer landing page and the default Domain layout. | 
| Profile explorer - Create | CustomerProfiles.ProfileExplorer.Create | [Create a Domain layout](https://docs.aws.amazon.com/connect/latest/APIReference/API_connect-customer-profiles_CreateDomainLayout.html) | 
| Profile explorer - Edit | CustomerProfiles.ProfileExplorer.Edit | [Edit a Domain layout](https://docs.aws.amazon.com/connect/latest/APIReference/API_connect-customer-profiles_UpdateDomainLayout.html) | 
| Profile explorer - Delete | CustomerProfiles.ProfileExplorer.Delete | [Delete a Domain layout](https://docs.aws.amazon.com/connect/latest/APIReference/API_connect-customer-profiles_DeleteDomainLayout.html) | 
| Predictive Insights - View | CustomerProfiles.PredictiveInsights.View | View [Predictive Insights](customer-profiles-predictive-insights.md). | 
| Predictive Insights - Create | CustomerProfiles.PredictiveInsights.Create | Create Predictive Insights. | 
| Predictive Insights - Edit | CustomerProfiles.PredictiveInsights.Edit | Edit Predictive Insights. | 
| Predictive Insights - Delete | CustomerProfiles.PredictiveInsights.Delete | Delete Predictive Insights. | 

## Scheduling
<a name="scheduling-permissions-list"></a>


| UI name | API name | Use | 
| --- | --- | --- | 
| Schedule manager - View | Scheduling.View |  [View generated staff schedules in the Schedule manager user experience](scheduling-publish-schedule.md).  | 
| Schedule manager - Edit | Scheduling.Edit | [Create, edit schedule configuration and publish generated staff schedules](scheduling-publish-schedule.md).  | 
| Schedule manager - Publish | Scheduling.Publish | [Publish a schedule](scheduling-publish-schedule.md) by using Schedule Manager. | 
| Published schedule calendar | Scheduling.View | [View](scheduling-view-schedule-staff.md) a schedule.  | 
| Time off requests - Approve, Edit, View | TimeOff.Approve<br />TimeOff.Edit<br />TimeOff.View | [Time off management](scheduling-time-off.md).  | 
| Time off balance - Edit, View | TimeOffBalance.Edit<br />TimeOffBalance.View | [Time off management](scheduling-time-off.md).  | 
| Team calendar | TeamCalendar.View | [View published staff schedules in the Published Calendar user experience](scheduling-view-schedule-supervisors.md).  | 
| Team calendar | TeamCalendar.Edit | [Edit published staff schedules in the Published Calendar user experience](scheduling-view-schedule-supervisors.md). | 

## Agent Applications
<a name="agentapplications-permissions-list"></a>


| UI name | API name | Use | 
| --- | --- | --- | 
| Agent application schedule calendar | StaffCalendar.View<br />StaffCalendar.Edit | [Ability for agents to view their schedules](scheduling-view-schedule-agents.md). The **Edit** permission is required for agents to view and use the **Time off **widget on their schedule that they use to request time off. If they only have **View** permission, the **Time off** widget will not appear on their schedule.<br />For an example image that shows the **Time off** widget on an agent's schedule, see [Agent initiated time off request](create-time-off-to.md#to-agent). | 
| Custom views | CustomViews.Access | Use the [step-by-step guides](step-by-step-guided-experiences.md) guide. | 
| agent assist | Wisdom.View | [View real-time recommendations in the agent workspace](use-realtime-recommendations.md). | 
| {{<3p app name}} - Access | {{<3p app name}}.Access | Allows agents to access a third-party application. | 
| {{Performance metrics}} - Access | Analytics.PerformanceMetrics.Access | Displays the **Performance metrics** option in the **Apps** dropdown menu in the agent workspace. For more information, see [Agent workspace performance dashboard](performance-dashboard-aw.md). | 
| {{Worklist}} - Access | ManualAssignAnyContact.Enable<br />ManualAssignMyContacts.Enable | Allows Agents to view the Worklist App that will display Contacts that can be Manually assigned. | 

## Content Management
<a name="contentmanagement-permissions-list"></a>


| UI name | API name | Use | 
| --- | --- | --- | 
| Message templates - View |  | View a list of message templates in the Connect Customer admin website.  | 
| Message templates - Edit |  | Edit message templates.  | 
| Message templates - Create |  | Create message templates.  | 
| Message templates - Delete |  | Delete message templates by using the Connect Customer admin website.  | 
| Quick responses - Create | ContentManagement.Create | [Set up a knowledge base to store quick responses](setup-knowledgebase.md). [Create](create-quick-responses.md), [import](add-data.md), and [view the import history](view-import-history.md) of quick responses that are displayed in the agent workspace.  | 
| Quick responses - Edit | ContentManagement.Edit |  [Edit](edit-quick-responses.md), [import](add-data.md), and [view the import history](view-import-history.md) of quick responses that are displayed in the agent workspace.  | 
| Quick responses - View | ContentManagement.View | View a list of quick responses in the Connect Customer admin website. | 
| Quick responses - Delete | ContentManagement.Delete |  [Delete quick responses](delete-qr.md) by using the Connect Customer admin website. | 

## Cases
<a name="cases-permissions-list"></a>


| UI name | API name | Use | 
| --- | --- | --- | 
| Audit History - View | CaseHistory.View | View the audit history of cases in the agent workspace. | 
| Cases - Create | Cases.Create | [Create cases in the agent workspace](create-cases.md).  | 
| Cases - View | Cases.View | View cases in the agent workspace. | 
| Cases - Edit | Cases.Edit | Edit cases in the agent workspace. | 
| Case Fields - Create | CaseFields.Create | [Create case fields](case-fields.md).  | 
| Case Fields - View | CaseFields.View | View case fields. | 
| Case Fields - Edit | CaseFields.Edit | Edit case fields. | 
| Case Templates - Create | CaseTemplates.Create | [Create case templates](case-templates.md).  | 
| Case Templates - View | CaseTemplates.View | View case templates. | 
| Case Templates - Edit | CaseTemplates.Edit | Edit case templates. | 
| Cases - Delete | Cases.Delete | Delete any case in the domain. | 
| My Cases - Delete | MyCases.Delete | Delete cases the user created. | 
| Case Comments - Edit | CaseComments.Edit | Edit any comment on a case. | 
| Case Comments - Delete | CaseComments.Delete | Delete any comment on a case. | 
| My Case Comments - Edit | MyCaseComments.Edit | Edit comments the user authored. | 
| My Case Comments - Delete | MyCaseComments.Delete | Delete comments the user authored. | 
| Case Custom Related Items - Edit | CaseCustomRelatedItems.Edit | Edit any custom related item on a case. | 
| Case Custom Related Items - Delete | CaseCustomRelatedItems.Delete | Delete any custom related item from a case. | 
| My Case Custom Related Items - Edit | MyCaseCustomRelatedItems.Edit | Edit custom related items the user created. | 
| My Case Custom Related Items - Delete | MyCaseCustomRelatedItems.Delete | Delete custom related items the user created. | 
| Case Contacts - Delete | CaseContacts.Delete | Remove any contact associated with a case. | 
| My Case Contacts - Delete | MyCaseContacts.Delete | Remove contact associations the user created. | 
| Case Files - Delete | CaseFiles.Delete | Delete any file attached to a case. | 

## Outbound Campaigns
<a name="campaigns-permissions-list"></a>


| UI name | API name | Use | 
| --- | --- | --- | 
| Campaigns - Create | Campaigns.Create | [Create outbound campaigns](how-to-create-campaigns.md). | 
| Campaigns - Delete | Campaigns.Delete | Delete outbound campaigns. | 
| Campaigns - Edit | Campaigns.Edit | Edit outbound campaigns. | 
| Campaigns - Manage | Campaigns.Delete | Manage outbound campaigns. | 
| Campaigns - View |   | View outbound campaigns. | 