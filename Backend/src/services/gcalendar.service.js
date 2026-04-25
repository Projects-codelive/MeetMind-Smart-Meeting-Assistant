const { google } = require('googleapis');
const Meeting = require('../models/Meeting.model');
const Integration = require('../models/Integration.model');

const createOAuth2Client = (integration) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.FRONTEND_URL}/api/integrations/google/callback`
  );
  oauth2Client.setCredentials({
    access_token: integration.accessToken,
    refresh_token: integration.refreshToken
  });
  return oauth2Client;
};

const autoScheduleFollowUps = async (meetingId, userId) => {
  try {
    const integration = await Integration.findOne({ userId, platform: 'gcalendar', isActive: true });
    if (!integration) {
      throw new Error('Google Calendar not connected');
    }

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      throw new Error('Meeting not found');
    }

    const aiService = require('./ai.service');
    const followUps = await aiService.detectFollowUpMeetings(meeting.summary || '');

    if (!followUps || followUps.length === 0) {
      await Meeting.updateOne(
        { _id: meetingId },
        { $set: { 'integrationStatus.gcalendar': 'skipped' } }
      );
      return { scheduled: [] };
    }

    const auth = createOAuth2Client(integration);
    const calendar = google.calendar({ version: 'v3', auth });

    const createdEvents = [];

    for (const followUp of followUps) {
      const event = {
        summary: followUp.title || 'Follow-up Meeting',
        description: `Auto-scheduled by MeetMind from meeting: ${meeting.title}`,
        attendees: (followUp.participants || []).map(email => ({ email })),
        start: { dateTime: new Date().toISOString(), timeZone: 'UTC' },
        end: { dateTime: new Date(Date.now() + 3600000).toISOString(), timeZone: 'UTC' }
      };

      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event
      });

      createdEvents.push(response.data.id);
    }

    await Meeting.updateOne(
      { _id: meetingId },
      { $set: { 'integrationStatus.gcalendar': 'done' } }
    );

    return { scheduled: createdEvents };
  } catch (error) {
    console.error('GCalendar Schedule Error:', error);
    await Meeting.updateOne(
      { _id: meetingId },
      { $set: { 'integrationStatus.gcalendar': 'failed' } }
    );
    throw error;
  }
};

const getPreMeetingBriefing = async (userId, eventId) => {
  try {
    const integration = await Integration.findOne({ userId, platform: 'gcalendar', isActive: true });
    if (!integration) return '';

    const auth = createOAuth2Client(integration);
    const calendar = google.calendar({ version: 'v3', auth });

    const eventResponse = await calendar.events.get({
      calendarId: 'primary',
      eventId
    });

    const event = eventResponse.data;
    
    const meetings = await Meeting.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    const aiService = require('./ai.service');
    const briefing = await aiService.generatePreMeetingBriefing(
      meetings.map(m => `${m.title}: ${m.summary}`).join('\n'),
      event.summary
    );

    return briefing;
  } catch (error) {
    console.error('Get Briefing Error:', error);
    return '';
  }
};

module.exports = {
  autoScheduleFollowUps,
  getPreMeetingBriefing
};