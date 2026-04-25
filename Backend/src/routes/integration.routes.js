const express = require('express');
const router = express.Router();
const integrationController = require('../controllers/integration.controller');

const platforms = ['notion', 'slack', 'google', 'jira', 'github', 'salesforce', 'asana', 'gdrive'];

const getUserId = (req) => {
  const clerkId = req.headers['x-clerk-user-id'];
  if (!clerkId) return 'demo-user-001';
  return clerkId;
};

router.get('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    console.log('GET /integrations/ - userId:', userId, 'headers:', req.headers['x-clerk-user-id']);
    
    try {
      const integrations = await integrationController.getIntegrations(userId);
      console.log('Integrations found:', integrations);
      res.json(integrations);
    } catch (err) {
      console.error('Get Integrations Error:', err);
      res.json([]);
    }
  } catch (error) {
    console.error('Get Integrations Error:', error);
    res.json([]);
  }
});

router.delete('/:platform', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { platform } = req.params;
    
    if (!platforms.includes(platform)) {
      return res.status(400).json({ error: 'Invalid platform' });
    }

    try {
      await integrationController.disconnectIntegration(userId, platform);
      res.json({ success: true });
    } catch (err) {
      res.json({ success: true });
    }
  } catch (error) {
    console.error('Disconnect Integration Error:', error);
    res.json({ success: true });
  }
});

router.post('/:platform/trigger', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { platform } = req.params;
    const { meetingId } = req.body;
    
    if (!platforms.includes(platform)) {
      return res.status(400).json({ error: 'Invalid platform' });
    }

    if (!meetingId) {
      return res.status(400).json({ error: 'Missing meeting ID' });
    }

    try {
      const result = await integrationController.triggerIntegration(userId, meetingId, platform);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: 'Failed to trigger integration' });
    }
  } catch (error) {
    console.error('Trigger Integration Error:', error);
    res.status(500).json({ error: 'Failed to trigger integration' });
  }
});

platforms.forEach(platform => {
  router.get(`/${platform}/connect`, async (req, res) => {
    try {
      const userId = getUserId(req);
      const oauthUrl = integrationController.getOAuthUrl(platform, userId);
      if (!oauthUrl) {
        return res.status(400).json({ error: 'Invalid platform' });
      }
      res.redirect(oauthUrl);
    } catch (error) {
      console.error('OAuth Connect Error:', error);
      res.status(500).json({ error: 'Failed to initiate OAuth' });
    }
  });

  router.get(`/${platform}/callback`, async (req, res) => {
    try {
      const { code, state: userId } = req.query;
      
      if (!code) {
        return res.status(400).json({ error: 'Missing authorization code' });
      }

      try {
        const tokens = await integrationController.exchangeCode(platform, code, userId);
        
        if (!tokens.access_token) {
          return res.status(400).json({ error: 'Failed to exchange code' });
        }

        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/integrations?connected=${platform}`);
      } catch (innerError) {
        console.error('Token Exchange Error:', innerError);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/integrations?error=${platform}`);
      }
    } catch (error) {
      console.error('OAuth Callback Error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/integrations?error=${platform}`);
    }
  });
});

module.exports = router;