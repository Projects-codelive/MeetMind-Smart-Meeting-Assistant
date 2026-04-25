const Meeting = require('../models/Meeting.model');
const notionController = require('../notion/notion.controller');

const NOTION_API_VERSION = '2022-06-28';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const formatMeetingTitle = (meeting) => {
  if (!meeting.startTime) {
    return 'MeetMind Meeting';
  }
  
  const date = new Date(meeting.startTime);
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayName = dayNames[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  
  const title = meeting.title || 'MeetMind Meeting';
  
  if (meeting.platform === 'google-meet') {
    return `${title} — ${dayName} ${day} ${month} ${year} ${displayHours}:${minutes} ${ampm}`;
  } else {
    return `${title} — ${day} ${month.substr(0, 3)} ${year}`;
  }
};

const formatDateTime = (date) => {
  if (!date) {
    return 'Date not available';
  }
  
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(date).toLocaleDateString('en-US', options);
};

const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} min`;
};

const buildMeetingPageContent = (meeting) => {
  const blocks = [];
  
  blocks.push({
    object: 'block',
    type: 'heading_1',
    heading_1: {
      rich_text: [{ type: 'text', text: { content: meeting.title || 'Meeting Notes' } }]
    }
  });

  blocks.push({
    object: 'block',
    type: 'divider',
    divider: {}
  });

  blocks.push({
    object: 'block',
    type: 'heading_2',
    heading_2: {
      rich_text: [{ type: 'text', text: { content: '📅 Meeting Details' } }]
    }
  });

  const detailsChildren = [
    {
      object: 'block',
      type: 'property_item',
      property_item: {
        type: 'date',
        date: { start: meeting.startTime }
      }
    }
  ];

  blocks.push({
    object: 'block',
    type: 'callout',
    callout: {
      rich_text: [
        { type: 'text', text: { content: '📆 Date & Time: ' } },
        { type: 'text', text: { content: formatDateTime(meeting.startTime), bold: true } }
      ],
      icon: { type: 'emoji', emoji: '📆' },
      color: 'blue_background'
    }
  });

  if (meeting.endTime) {
    const durationMs = new Date(meeting.endTime) - new Date(meeting.startTime);
    const durationSeconds = Math.floor(durationMs / 1000);
    
    blocks.push({
      object: 'block',
      type: 'callout',
      callout: {
        rich_text: [
          { type: 'text', text: { content: '⏱️ Duration: ' } },
          { type: 'text', text: { content: formatDuration(durationSeconds), bold: true } }
        ],
        icon: { type: 'emoji', emoji: '⏱️' },
        color: 'gray_background'
      }
    });
  }

  if (meeting.platform) {
    const platformNames = {
      'google-meet': 'Google Meet',
      'zoom': 'Zoom',
      'teams': 'Microsoft Teams',
      'other': 'Other'
    };
    
    blocks.push({
      object: 'block',
      type: 'callout',
      callout: {
        rich_text: [
          { type: 'text', text: { content: '💻 Platform: ' } },
          { type: 'text', text: { content: platformNames[meeting.platform] || meeting.platform, bold: true } }
        ],
        icon: { type: 'emoji', emoji: '💻' },
        color: 'gray_background'
      }
    });
  }

  if (meeting.participants && meeting.participants.length > 0) {
    blocks.push({
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: '👥 Attendees' } }]
      }
    });

    meeting.participants.forEach(participant => {
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [
            { type: 'text', text: { content: participant.name || 'Unknown', bold: true } }
          ],
          children: participant.email ? [
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: [
                  { type: 'text', text: { content: participant.email, color: 'gray' } }
                ]
              }
            }
          ] : []
        }
      });
    });
  }

  if (meeting.summary && typeof meeting.summary === 'string') {
    blocks.push({
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: '📋 Summary' } }]
      }
    });

    const summaryParagraphs = meeting.summary.split('\n').filter(p => p.trim());
    summaryParagraphs.forEach(paragraph => {
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: paragraph.trim() } }]
        }
      });
    });
  }

  if (meeting.keyDecisions && meeting.keyDecisions.length > 0) {
    blocks.push({
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: '✅ Key Decisions' } }]
      }
    });

    meeting.keyDecisions.forEach(decision => {
      if (!decision) return;
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: decision } }]
        }
      });
    });
  }

  if (meeting.actionItems && meeting.actionItems.length > 0) {
    blocks.push({
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: '🎯 Action Items' } }]
      }
    });

    meeting.actionItems.forEach(item => {
      const taskText = item.task || 'Untitled task';
      const assigneeText = item.assignee ? ` (${item.assignee})` : '';
      blocks.push({
        object: 'block',
        type: 'to_do',
        to_do: {
          rich_text: [
            { type: 'text', text: { content: taskText + assigneeText } }
          ],
          checked: item.status === 'done'
        }
      });
    });
  }

  if (meeting.topics && meeting.topics.length > 0) {
    blocks.push({
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: '📝 Topics Discussed' } }]
      }
    });

    meeting.topics.forEach(topic => {
      if (!topic) return;
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: topic } }]
        }
      });
    });
  }

  blocks.push({
    object: 'block',
    type: 'divider',
    divider: {}
  });

  blocks.push({
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [
        { type: 'text', text: { content: 'Created by ' } },
        { type: 'text', text: { content: 'MeetMind', bold: true } },
        { type: 'text', text: { content: ` on ${new Date().toLocaleDateString()}` } }
      ]
    }
  });

  return blocks;
};

const createPageWithRetry = async (userId, meetingId, parentPageId = null, retryCount = 0) => {
  try {
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      throw new Error('Meeting not found');
    }

    const pageTitle = formatMeetingTitle(meeting);
    const pageContent = buildMeetingPageContent(meeting);

    const pageData = {
      properties: {
        title: {
          title: [{ text: { content: pageTitle } }]
        }
      },
      children: pageContent
    };

    const notionPage = await notionController.createNotionPage(userId, parentPageId, pageData);

    await Meeting.updateOne(
      { _id: meetingId },
      { 
        $set: { 
          'integrationStatus.notion': 'done',
          'notionPageUrl': notionPage.url,
          'notionPageId': notionPage.id
        }
      }
    );

    return {
      success: true,
      pageUrl: notionPage.url,
      pageId: notionPage.id,
      pageTitle
    };
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
      return createPageWithRetry(userId, meetingId, parentPageId, retryCount + 1);
    }

    await Meeting.updateOne(
      { _id: meetingId },
      { 
        $set: { 
          'integrationStatus.notion': 'failed',
          'notionError': error.message
        }
      }
    );

    throw error;
  }
};

const createMeetingPage = async (meetingId, userId) => {
  return createPageWithRetry(userId, meetingId);
};

const retryFailedMeetingPage = async (meetingId, userId) => {
  const meeting = await Meeting.findById(meetingId);
  if (!meeting) {
    throw new Error('Meeting not found');
  }

  if (meeting.integrationStatus?.notion !== 'failed') {
    throw new Error('Meeting is not in failed state');
  }

  return createPageWithRetry(userId, meetingId);
};

const getPendingMeetings = async () => {
  return Meeting.find({
    'integrationStatus.notion': 'pending',
    status: 'completed'
  });
};

const syncAllPendingMeetings = async () => {
  const pendingMeetings = await getPendingMeetings();
  const results = [];

  for (const meeting of pendingMeetings) {
    try {
      const result = await createMeetingPage(meeting._id, meeting.userId);
      results.push({ meetingId: meeting._id, ...result });
    } catch (error) {
      results.push({ meetingId: meeting._id, success: false, error: error.message });
    }
  }

  return results;
};

module.exports = {
  createMeetingPage,
  retryFailedMeetingPage,
  getPendingMeetings,
  syncAllPendingMeetings,
  formatMeetingTitle,
  buildMeetingPageContent
};