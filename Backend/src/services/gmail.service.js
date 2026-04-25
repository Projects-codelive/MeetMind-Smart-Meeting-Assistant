const { google } = require('googleapis');
const Meeting = require('../models/Meeting.model');
const Integration = require('../models/Integration.model');
const nodemailer = require('nodemailer');

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

const sendFollowUpEmail = async (meetingId, userId) => {
  try {
    const integration = await Integration.findOne({ userId, platform: 'gmail', isActive: true });
    if (!integration) {
      throw new Error('Gmail not connected');
    }

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      throw new Error('Meeting not found');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: integration.platformUserId,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        accessToken: integration.accessToken,
        refreshToken: integration.refreshToken
      }
    });

    const participantEmails = meeting.participants?.map(p => p.email).filter(Boolean) || [];

    if (participantEmails.length === 0) {
      throw new Error('No participant emails found');
    }

    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>MeetMind Summary: ${meeting.title || 'Meeting'}</h1>
          <p><strong>Date:</strong> ${new Date(meeting.startTime).toLocaleString()}</p>
          <p><strong>Duration:</strong> ${Math.floor((meeting.duration || 0) / 60)} minutes</p>
          
          <h2>📋 Summary</h2>
          <p>${meeting.summary || 'No summary available.'}</p>
          
          ${meeting.actionItems?.length > 0 ? `
            <h2>✅ Action Items</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background: #f5f5f5;">
                <th style="padding: 8px; text-align: left;">Task</th>
                <th style="padding: 8px; text-align: left;">Assignee</th>
                <th style="padding: 8px; text-align: left;">Due Date</th>
              </tr>
              ${meeting.actionItems.map(item => `
                <tr>
                  <td style="padding: 8px;">${item.task}</td>
                  <td style="padding: 8px;">${item.assignee || 'Unassigned'}</td>
                  <td style="padding: 8px;">${item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'No due date'}</td>
                </tr>
              `).join('')}
            </table>
          ` : ''}
          
          ${meeting.keyDecisions?.length > 0 ? `
            <h2>🎯 Key Decisions</h2>
            <ul>
              ${meeting.keyDecisions.map(d => `<li>${d}</li>`).join('')}
            </ul>
          ` : ''}
          
          <p style="margin-top: 30px; color: #888;">
            Sent by <a href="https://meetmind.ai">MeetMind</a> — Your Smart Meeting Assistant
          </p>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: integration.platformUserId,
      to: participantEmails,
      subject: `MeetMind Summary: ${meeting.title || 'Meeting'} — ${new Date(meeting.startTime).toLocaleDateString()}`,
      html: htmlContent
    });

    await Meeting.updateOne(
      { _id: meetingId },
      { $set: { 'integrationStatus.gmail': 'done' } }
    );

    return { sent: true };
  } catch (error) {
    console.error('Gmail Send Error:', error);
    await Meeting.updateOne(
      { _id: meetingId },
      { $set: { 'integrationStatus.gmail': 'failed' } }
    );
    throw error;
  }
};

module.exports = {
  sendFollowUpEmail
};