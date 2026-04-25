const Integration = require('../models/Integration.model');

const OAuthConfigs = {
  notion: {
    authUrl: 'https://api.notion.com/v1/oauth/authorize',
    tokenUrl: 'https://api.notion.com/v1/oauth/token',
    scope: 'authorization_code',
    clientId: process.env.NOTION_CLIENT_ID,
    clientSecret: process.env.NOTION_CLIENT_SECRET,
    redirectUri: 'http://localhost:5001/api/notion/callback'
  },
  slack: {
    authUrl: 'https://slack.com/oauth/v2/authorize',
    tokenUrl: 'https://slack.com/api/oauth.v2.access',
    scope: 'chat:write,channels:read,users:read,channels:manage',
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    redirectUri: process.env.SLACK_REDIRECT_URI || `${process.env.FRONTEND_URL}/api/integrations/slack/callback`
  },
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/drive.file',
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: `${process.env.FRONTEND_URL}/api/integrations/google/callback`
  },
  jira: {
    authUrl: process.env.JIRA_AUTH_URL || 'https://auth.atlassian.com/authorize',
    tokenUrl: process.env.JIRA_TOKEN_URL || 'https://auth.atlassian.com/oauth/token',
    scope: 'write:jira-work read:jira-work read:jira-admin offline_access',
    clientId: process.env.JIRA_CLIENT_ID,
    clientSecret: process.env.JIRA_CLIENT_SECRET,
    redirectUri: process.env.JIRA_REDIRECT_URI || 'http://localhost:5001/api/integrations/jira/callback'
  },
  github: {
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    scope: 'repo',
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    redirectUri: `${process.env.FRONTEND_URL}/api/integrations/github/callback`
  }
};

const getIntegrations = async (userId) => {
  try {
    const integrations = await Integration.find({ userId });
    return integrations;
  } catch (error) {
    console.error('Get Integrations Error:', error);
    throw error;
  }
};

const connectIntegration = async (userId, platform, tokens) => {
  try {
    const integration = await Integration.findOneAndUpdate(
      { userId, platform },
      {
        userId,
        platform,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiry: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : null,
        platformUserId: tokens.platform_user_id,
        isActive: true,
        lastUsed: new Date()
      },
      { new: true, upsert: true }
    );

    return integration;
  } catch (error) {
    console.error('Connect Integration Error:', error);
    throw error;
  }
};

const disconnectIntegration = async (userId, platform) => {
  try {
    await Integration.findOneAndDelete({ userId, platform });
    return { success: true };
  } catch (error) {
    console.error('Disconnect Integration Error:', error);
    throw error;
  }
};

const getOAuthUrl = (platform, userId) => {
  const config = OAuthConfigs[platform];
  if (!config) return null;

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scope,
    response_type: 'code',
    state: userId
  });

  return `${config.authUrl}?${params.toString()}`;
};

const exchangeCode = async (platform, code, userId) => {
  const config = OAuthConfigs[platform];
  if (!config) throw new Error('Invalid platform');

  let body, headers;
  
  if (platform === 'jira') {
    body = JSON.stringify({
      grant_type: 'authorization_code',
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: config.redirectUri
    });
    headers = { 'Content-Type': 'application/json' };
  } else {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: config.redirectUri
    });
    body = params.toString();
    headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  }

  try {
    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers,
      body
    });

    const tokens = await response.json();
    
    if (!tokens.access_token) {
      console.error('Token exchange failed:', tokens);
      throw new Error('Failed to exchange code for token');
    }
    
    await connectIntegration(userId, platform, tokens);
    
    return tokens;
  } catch (error) {
    console.error('Exchange Code Error:', error);
    throw error;
  }
};

const triggerIntegration = async (userId, meetingId, platform) => {
  try {
    const integration = await Integration.findOne({ userId, platform, isActive: true });
    if (!integration) {
      throw new Error('Integration not connected');
    }

    let result;
    switch (platform) {
      case 'notion':
        const notionService = require('../notion/notion.service');
        result = await notionService.createMeetingPage(meetingId, userId);
        break;
      case 'slack':
        result = await service.postMeetingSummary(meetingId, userId);
        break;
      case 'gcalendar':
        result = await service.autoScheduleFollowUps(meetingId, userId);
        break;
      case 'gmail':
        result = await service.sendFollowUpEmail(meetingId, userId);
        break;
      case 'jira':
        result = await service.createIssuesFromActionItems(meetingId, userId);
        break;
      case 'asana':
        result = await service.createTasksFromActionItems(meetingId, userId);
        break;
      default:
        throw new Error('Unsupported platform');
    }

    integration.lastUsed = new Date();
    await integration.save();

    return result;
  } catch (error) {
    console.error('Trigger Integration Error:', error);
    throw error;
  }
};

module.exports = {
  getIntegrations,
  connectIntegration,
  disconnectIntegration,
  getOAuthUrl,
  exchangeCode,
  triggerIntegration
};