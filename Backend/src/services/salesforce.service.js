const axios = require('axios');
const Meeting = require('../models/Meeting.model');
const Integration = require('../models/Integration.model');

const createSalesforceClient = (integration) => {
  return axios.create({
    baseURL: 'https://your-domain.salesforce.com/services/data/v58.0',
    headers: {
      'Authorization': `Bearer ${integration.accessToken}`,
      'Content-Type': 'application/json'
    }
  });
};

const updateCRMFromMeeting = async (meetingId, userId) => {
  try {
    const integration = await Integration.findOne({ userId, platform: 'salesforce', isActive: true });
    if (!integration) {
      throw new Error('Salesforce not connected');
    }

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      throw new Error('Meeting not found');
    }

    const sfClient = createSalesforceClient(integration);

    const meetingNotes = `
      Meeting: ${meeting.title || 'Untitled'}
      Date: ${new Date(meeting.startTime).toLocaleString()}
      Duration: ${Math.floor((meeting.duration || 0) / 60)} minutes
      Summary: ${meeting.summary || 'No summary'}
      Decisions: ${(meeting.keyDecisions || []).join('; ')}
      Sentiment: ${meeting.sentiment || 'neutral'}
    `;

    for (const participant of meeting.participants || []) {
      if (participant.email) {
        try {
          const contactQuery = await sfClient.get(`/query?q=SELECT Id FROM Contact WHERE Email='${participant.email}'`);
          
          if (contactQuery.data.records && contactQuery.data.records.length > 0) {
            const contactId = contactQuery.data.records[0].Id;
            
            await sfClient.post('/sobjects/Task', {
              Subject: `Meeting: ${meeting.title}`,
              Description: meetingNotes,
              WhoId: contactId,
              Status: 'Completed',
              Priority: 'Normal',
              ActivityDate: new Date().toISOString().split('T')[0]
            });
          }
        } catch (err) {
          console.error('Salesforce Contact Error:', err);
        }
      }
    }

    await Meeting.updateOne(
      { _id: meetingId },
      { $set: { 'integrationStatus.salesforce': 'done' } }
    );

    return { success: true };
  } catch (error) {
    console.error('Salesforce Update Error:', error);
    await Meeting.updateOne(
      { _id: meetingId },
      { $set: { 'integrationStatus.salesforce': 'failed' } }
    );
    throw error;
  }
};

module.exports = {
  updateCRMFromMeeting
};