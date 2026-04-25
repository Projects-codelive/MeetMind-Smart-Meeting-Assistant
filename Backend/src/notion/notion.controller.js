const Integration = require('../models/Integration.model');

const NOTION_API_VERSION = '2022-06-28';

const getNotionOAuthUrl = (userId) => {
  const redirectUri = 'http://localhost:5001/api/notion/callback';
  const clientId = process.env.NOTION_CLIENT_ID;
  
  console.log('OAuth URL Config:', { clientId, redirectUri, frontendUrl: process.env.FRONTEND_URL });
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    state: userId
  });

  const url = `https://api.notion.com/v1/oauth/authorize?${params.toString()}`;
  console.log('Generated OAuth URL:', url);
  
  return url;
};

const exchangeNotionCode = async (code, userId) => {
  const redirectUri = 'http://localhost:5001/api/notion/callback';
  const clientId = process.env.NOTION_CLIENT_ID;
  const clientSecret = process.env.NOTION_CLIENT_SECRET;

  console.log('Token exchange starting:', { clientId: !!clientId, clientSecret: !!clientSecret, redirectUri });

  if (!clientId || !clientSecret) {
    throw new Error('Notion credentials not configured');
  }

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    client_secret: clientSecret,
    code,
    redirect_uri: redirectUri
  });

  try {
    const response = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      },
      body: params.toString()
    });

    const data = await response.json();
    console.log('Token response:', { status: response.status, hasAccessToken: !!data.access_token, hasError: !!data.error });
    
    if (!response.ok) {
      throw new Error(data.error_description || data.error || 'Failed to exchange code');
    }

    return {
      accessToken: data.access_token,
      workspaceId: data.workspace_id,
      workspaceName: data.workspace_name,
      ownerName: data.owner?.name || 'Notion User',
      ownerEmail: data.owner?.person?.email || '',
      workspaceIcon: data.workspace_icon,
      botId: data.bot_id
    };
  } catch (error) {
    console.error('Notion Token Exchange Error:', error);
    throw error;
  }
};

const saveNotionIntegration = async (userId, tokenData) => {
  try {
    const integration = await Integration.findOneAndUpdate(
      { userId, platform: 'notion' },
      {
        userId,
        platform: 'notion',
        accessToken: tokenData.accessToken,
        platformWorkspace: tokenData.workspaceId,
        platformWorkspaceName: tokenData.workspaceName,
        platformOwnerName: tokenData.ownerName,
        platformOwnerEmail: tokenData.ownerEmail,
        isActive: true,
        lastUsed: new Date()
      },
      { new: true, upsert: true }
    );

    return integration;
  } catch (error) {
    console.error('Save Notion Integration Error:', error);
    throw error;
  }
};

const getIntegration = async (userId, platform = 'notion') => {
  return Integration.findOne({ userId, platform, isActive: true });
};

const updateParentPage = async (userId, parentPageId) => {
  return Integration.findOneAndUpdate(
    { userId, platform: 'notion', isActive: true },
    { parentPageId },
    { new: true }
  );
};

const searchNotionPages = async (userId) => {
  const integration = await getIntegration(userId);
  if (!integration) {
    throw new Error('Notion not connected');
  }

  try {
    const response = await fetch('https://api.notion.com/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${integration.accessToken}`,
        'Notion-Version': NOTION_API_VERSION,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filter: { property: 'object', value: 'page' },
        sort: { direction: 'descending', timestamp: 'last_edited_time' },
        page_size: 20
      })
    });

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Search Notion Pages Error:', error);
    throw error;
  }
};

const createNotionPage = async (userId, parentPageId, pageData) => {
  const integration = await getIntegration(userId);
  if (!integration) {
    throw new Error('Notion not connected');
  }

  const parent = parentPageId 
    ? { page_id: parentPageId }
    : { page_id: integration.parentPageId };

  if (!parent.page_id) {
    throw new Error('No parent page set. Please select a page first.');
  }

  try {
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${integration.accessToken}`,
        'Notion-Version': NOTION_API_VERSION,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        parent,
        properties: pageData.properties,
        children: pageData.children
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create page');
    }

    return data;
  } catch (error) {
    console.error('Create Notion Page Error:', error);
    throw error;
  }
};

const verifyConnection = async (userId) => {
  const integration = await getIntegration(userId);
  if (!integration) {
    return { connected: false };
  }

  try {
    const response = await fetch('https://api.notion.com/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${integration.accessToken}`,
        'Notion-Version': NOTION_API_VERSION
      }
    });

    if (!response.ok) {
      await Integration.findOneAndDelete({ userId, platform: 'notion' });
      return { connected: false, error: 'Token invalid or revoked' };
    }

    return {
      connected: true,
      ownerName: integration.platformOwnerName,
      ownerEmail: integration.platformOwnerEmail,
      workspaceName: integration.platformWorkspaceName
    };
  } catch (error) {
    return { connected: false, error: error.message };
  }
};

module.exports = {
  getNotionOAuthUrl,
  exchangeNotionCode,
  saveNotionIntegration,
  getIntegration,
  updateParentPage,
  searchNotionPages,
  createNotionPage,
  verifyConnection
};