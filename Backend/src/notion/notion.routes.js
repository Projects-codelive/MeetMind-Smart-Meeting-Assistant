const express = require('express');
const router = express.Router();
const notionController = require('./notion.controller');
const notionService = require('./notion.service');

const getUserId = (req) => {
  const clerkId = req.headers['x-clerk-user-id'];
  if (!clerkId) return 'demo-user-001';
  return clerkId;
};

router.get('/connect', async (req, res) => {
  try {
    const userId = req.query.userId || getUserId(req);
    const oauthUrl = notionController.getNotionOAuthUrl(userId);
    console.log('Notion Connect - UserId:', userId, '- Redirecting to:', oauthUrl);
    res.redirect(oauthUrl);
  } catch (error) {
    console.error('Notion Connect Error:', error);
    res.redirect('http://localhost:3000/dashboard/integrations?error=notion');
  }
});

router.get('/callback', async (req, res) => {
  try {
    const { code, state: oauthUserId } = req.query;
    const clerkUserId = req.headers['x-clerk-user-id'] || oauthUserId;
    
    console.log('=== NOTION CALLBACK RECEIVED ===');
    console.log('Query params:', req.query);
    console.log('UserId from OAuth state:', oauthUserId);
    console.log('Clerk user ID header:', clerkUserId);
    console.log('Has code:', !!code);
    
    if (!code) {
      console.log('ERROR: No code received from Notion');
      return res.redirect('http://localhost:3000/dashboard/integrations?error=notion');
    }

    console.log('Starting token exchange...');
    const tokenData = await notionController.exchangeNotionCode(code, clerkUserId);
    console.log('Token exchange successful!');
    console.log('Workspace:', tokenData.workspaceName);
    
    console.log('Saving integration for user:', clerkUserId);
    await notionController.saveNotionIntegration(clerkUserId, tokenData);
    console.log('Integration saved successfully!');

    res.redirect('http://localhost:3000/dashboard/integrations?connected=notion');
  } catch (error) {
    console.error('=== NOTION CALLBACK ERROR ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    res.redirect('http://localhost:3000/dashboard/integrations?error=notion');
  }
});

function getCallbackPage(status, message) {
  const isSuccess = status === 'success';
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>MeetMind - Notion Connection</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .card {
          background: white;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          text-align: center;
          max-width: 400px;
          width: 90%;
        }
        .icon {
          font-size: 60px;
          margin-bottom: 20px;
        }
        h1 {
          color: #333;
          margin-bottom: 16px;
          font-size: 24px;
        }
        p {
          color: #666;
          margin-bottom: 24px;
          line-height: 1.6;
        }
        .btn {
          display: inline-block;
          padding: 14px 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 16px;
          transition: transform 0.2s;
        }
        .btn:hover { transform: translateY(-2px); }
        .error .icon { color: #e74c3c; }
        .success .icon { color: #2ecc71; }
      </style>
    </head>
    <body>
      <div class="card ${status}">
        <div class="icon">${isSuccess ? '✅' : '❌'}</div>
        <h1>${isSuccess ? 'Notion Connected!' : 'Connection Failed'}</h1>
        <p>${message}</p>
        <form action="http://localhost:3000/dashboard/integrations" method="GET">
          <input type="hidden" name="connected" value="notion">
          <button type="submit" class="btn">Go to Dashboard</button>
        </form>
      </div>
    </body>
    </html>
  `;
}

router.get('/status', async (req, res) => {
  try {
    const userId = getUserId(req);
    const verification = await notionController.verifyConnection(userId);
    res.json(verification);
  } catch (error) {
    res.json({ connected: false, error: error.message });
  }
});

router.get('/pages', async (req, res) => {
  try {
    const userId = getUserId(req);
    const pages = await notionController.searchNotionPages(userId);
    
    const simplifiedPages = pages.map(page => ({
      id: page.id,
      title: page.properties?.title?.title?.[0]?.plain_text || 'Untitled',
      lastEdited: page.last_edited_time,
      url: `https://www.notion.so/${page.id.replace(/-/g, '')}`
    }));
    
    res.json(simplifiedPages);
  } catch (error) {
    console.error('Get Notion Pages Error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/parent', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { pageId } = req.body;
    
    if (!pageId) {
      return res.status(400).json({ error: 'Page ID required' });
    }

    const integration = await notionController.updateParentPage(userId, pageId);
    
    if (!integration) {
      return res.status(404).json({ error: 'Notion not connected' });
    }

    res.json({ success: true, message: 'Parent page set successfully' });
  } catch (error) {
    console.error('Set Parent Page Error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/disconnect', async (req, res) => {
  try {
    const userId = getUserId(req);
    const Integration = require('../models/Integration.model');
    await Integration.findOneAndDelete({ userId, platform: 'notion' });
    res.json({ success: true });
  } catch (error) {
    console.error('Notion Disconnect Error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/create-page', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { meetingId, parentPageId } = req.body;
    
    if (!meetingId) {
      return res.status(400).json({ error: 'Meeting ID required' });
    }

    const result = await notionService.createMeetingPage(meetingId, userId);
    res.json(result);
  } catch (error) {
    console.error('Create Page Error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/retry-page', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { meetingId } = req.body;
    
    if (!meetingId) {
      return res.status(400).json({ error: 'Meeting ID required' });
    }

    const result = await notionService.retryFailedMeetingPage(meetingId, userId);
    res.json(result);
  } catch (error) {
    console.error('Retry Page Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;