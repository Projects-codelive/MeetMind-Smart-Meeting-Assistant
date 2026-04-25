const axios = require('axios');
const Meeting = require('../models/Meeting.model');
const Integration = require('../models/Integration.model');

const createOAuthClient = (integration) => {
  return axios.create({
    baseURL: 'https://slack.com/api',
    headers: {
      'Authorization': `Bearer ${integration.accessToken}`,
      'Content-Type': 'application/json'
    }
  });
};

const postMeetingSummary = async (meetingId, userId) => {
  try {
    const integration = await Integration.findOne({ userId, platform: 'slack', isActive: true });
    if (!integration) {
      throw new Error('Slack not connected');
    }

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      throw new Error('Meeting not found');
    }

    const blocks = [
      {
        type: 'header',
        text: { type: 'plain_text', text: `📋 Meeting Summary — ${meeting.title || 'Untitled'}` }
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*${meeting.summary || 'No summary available.'}*` }
      }
    ];

    if (meeting.actionItems?.length > 0) {
      blocks.push({
        type: 'section',
        text: { type: 'mrkdwn', text: '*Action Items:*' }
      });

      meeting.actionItems.forEach(item => {
        blocks.push({
          type: 'section',
          text: { type: 'mrkdwn', text: `• ${item.task}${item.assignee ? ` — <@${item.assignee}>` : ''}${item.dueDate ? ` (Due: ${new Date(item.dueDate).toLocaleDateString()})` : ''}` }
        });
      });
    }

    if (meeting.keyDecisions?.length > 0) {
      blocks.push({
        type: 'section',
        text: { type: 'mrkdwn', text: '*Key Decisions:*' }
      });
      meeting.keyDecisions.forEach(decision => {
        blocks.push({
          type: 'section',
          text: { type: 'mrkdwn', text: `• ${decision}` }
        });
      });
    }

    const slackClient = createOAuthClient(integration);
    
    const channelId = integration.config?.channelId || integration.platformUserId;
    
    await slackClient.post('/chat.postMessage', {
      channel: channelId,
      blocks
    });

    await Meeting.updateOne(
      { _id: meetingId },
      { $set: { 'integrationStatus.slack': 'done' } }
    );

    return { success: true };
  } catch (error) {
    console.error('Slack Post Summary Error:', error);
    await Meeting.updateOne(
      { _id: meetingId },
      { $set: { 'integrationStatus.slack': 'failed' } }
    );
    throw error;
  }
};

const sendDirectActionItemAlerts = async (meetingId, userId) => {
  try {
    const integration = await Integration.findOne({ userId, platform: 'slack', isActive: true });
    if (!integration) return;

    const meeting = await Meeting.findById(meetingId);
    if (!meeting || !meeting.actionItems) return;

    const slackClient = createOAuthClient(integration);

    for (const item of meeting.actionItems) {
      if (item.assignee) {
        const userResponse = await slackClient.post('/users.lookupByEmail', {
          email: item.assignee
        });

        if (userResponse.data.ok && userResponse.data.user) {
          await slackClient.post('/chat.postMessage', {
            channel: userResponse.data.user.id,
            text: `📌 New action item from ${meeting.title}: ${item.task}${item.dueDate ? ` — due ${new Date(item.dueDate).toLocaleDateString()}` : ''}`
          });
        }
      }
    }
  } catch (error) {
    console.error('Slack DM Alerts Error:', error);
  }
};

module.exports = {
  postMeetingSummary,
  sendDirectActionItemAlerts
};