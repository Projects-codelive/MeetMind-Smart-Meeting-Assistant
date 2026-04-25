const axios = require('axios');
const Meeting = require('../models/Meeting.model');
const Integration = require('../models/Integration.model');

const createJiraClient = (integration) => {
  return axios.create({
    baseURL: `https://${integration.config?.domain || 'your-domain'}.atlassian.net/rest/api/3`,
    headers: {
      'Authorization': `Bearer ${integration.accessToken}`,
      'Content-Type': 'application/json'
    }
  });
};

const createIssuesFromActionItems = async (meetingId, userId) => {
  try {
    const integration = await Integration.findOne({ userId, platform: 'jira', isActive: true });
    if (!integration) {
      throw new Error('Jira not connected');
    }

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      throw new Error('Meeting not found');
    }

    if (!meeting.actionItems || meeting.actionItems.length === 0) {
      await Meeting.updateOne(
        { _id: meetingId },
        { $set: { 'integrationStatus.jira': 'skipped' } }
      );
      return [];
    }

    const jiraClient = createJiraClient(integration);
    const projectKey = integration.config?.projectKey || 'MEET';

    const createdIssues = [];

    for (const item of meeting.actionItems) {
      const issueData = {
        fields: {
          project: { key: projectKey },
          summary: item.task,
          description: {
            type: 'doc',
            version: 1,
            content: [{
              type: 'paragraph',
              content: [{
                type: 'text',
                text: `Auto-created by MeetMind from meeting: ${meeting.title}\n\nContext: ${meeting.summary || 'See transcript for full context.'}`
              }]
            }]
          },
          issuetype: { name: 'Task' },
          priority: { name: item.priority || 'Medium' }
        }
      };

      if (item.assignee) {
        issueData.fields.assignee = { name: item.assignee };
      }

      if (item.dueDate) {
        issueData.fields.duedate = new Date(item.dueDate).toISOString().split('T')[0];
      }

      const response = await jiraClient.post('/issue', issueData);
      createdIssues.push(response.data.key);
    }

    await Meeting.updateOne(
      { _id: meetingId },
      { $set: { 'integrationStatus.jira': 'done' } }
    );

    return createdIssues;
  } catch (error) {
    console.error('Jira Create Issues Error:', error);
    await Meeting.updateOne(
      { _id: meetingId },
      { $set: { 'integrationStatus.jira': 'failed' } }
    );
    throw error;
  }
};

module.exports = {
  createIssuesFromActionItems
};