const PLATFORMS = ['google-meet', 'zoom', 'teams', 'other'];
const MEETING_STATUS = ['active', 'processing', 'completed'];
const PLANS = ['free', 'pro', 'enterprise'];
const ACTION_ITEM_STATUS = ['pending', 'done'];
const INTEGRATION_STATUS = ['pending', 'done', 'failed', 'skipped'];
const SENTIMENT = ['positive', 'neutral', 'negative'];
const EXPRESSIONS = ['engaged', 'confused', 'distracted', 'nodding'];

const INTEGRATION_PLATFORMS = [
  'notion',
  'slack',
  'gcalendar',
  'gmail',
  'jira',
  'github',
  'salesforce',
  'asana',
  'gdrive'
];

const AI_MODELS = {
  SUMMARY: 'claude-3-5-sonnet-20241022',
  TRANSCRIPTION: 'whisper-1'
};

const RATE_LIMITS = {
  DEFAULT: 100,
  AUTH: 10,
  AI: 50
};

const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
};

module.exports = {
  PLATFORMS,
  MEETING_STATUS,
  PLANS,
  ACTION_ITEM_STATUS,
  INTEGRATION_STATUS,
  SENTIMENT,
  EXPRESSIONS,
  INTEGRATION_PLATFORMS,
  AI_MODELS,
  RATE_LIMITS,
  PAGINATION
};