const axios = require('axios');
const Meeting = require('../models/Meeting.model');
const Integration = require('../models/Integration.model');

const NOTION_API_VERSION = '2022-06-28';

const createMeetingPage = async (meetingId, userId) => {
  try {
    const integration = await Integration.findOne({ userId, platform: 'notion', isActive: true });
    if (!integration) {
      throw new Error('Notion not connected');
    }

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      throw new Error('Meeting not found');
    }

    const pageContent = {
      parent: { page_id: integration.config?.databaseId || 'root' },
      properties: {
        title: {
          title: [{ text: { content: `${new Date(meeting.startTime).toLocaleDateString()} — ${meeting.title || 'Meeting'}` } }]
        },
        Date: {
          date: { start: meeting.startTime.toISOString() }
        },
        Duration: {
          rich_text: [{ text: { content: `${Math.floor(meeting.duration / 60)} min` } }]
        },
        Participants: {
          rich_text: [{ text: { content: meeting.participants?.map(p => p.name).join(', ') || 'N/A' } }]
        }
      },
      children: [
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ text: { content: '📋 Summary' } }]
          }
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ text: { content: meeting.summary || 'No summary available.' } }]
          }
        }
      ]
    };

    const response = await axios.post('https://api.notion.com/v1/pages', pageContent, {
      headers: {
        'Authorization': `Bearer ${integration.accessToken}`,
        'Notion-Version': NOTION_API_VERSION,
        'Content-Type': 'application/json'
      }
    });

    await Meeting.updateOne(
      { _id: meetingId },
      { $set: { 'integrationStatus.notion': 'done' } }
    );

    return { notionPageUrl: response.data.url };
  } catch (error) {
    console.error('Notion Create Page Error:', error);
    await Meeting.updateOne(
      { _id: meetingId },
      { $set: { 'integrationStatus.notion': 'failed' } }
    );
    throw error;
  }
};

const searchDatabases = async (userId) => {
  try {
    const integration = await Integration.findOne({ userId, platform: 'notion', isActive: true });
    if (!integration) return [];

    const response = await axios.post('https://api.notion.com/v1/search', {
      filter: { property: 'object', value: 'database' }
    }, {
      headers: {
        'Authorization': `Bearer ${integration.accessToken}`,
        'Notion-Version': NOTION_API_VERSION
      }
    });

    return response.data.results;
  } catch (error) {
    console.error('Notion Search Databases Error:', error);
    return [];
  }
};

module.exports = {
  createMeetingPage,
  searchDatabases
};