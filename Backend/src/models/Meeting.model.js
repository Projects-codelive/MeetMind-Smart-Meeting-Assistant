const mongoose = require('mongoose');

const actionItemSchema = new mongoose.Schema({
  task: String,
  assignee: String,
  dueDate: Date,
  status: { type: String, enum: ['pending', 'done'], default: 'pending' }
});

const participantSchema = new mongoose.Schema({
  name: String,
  email: String,
  speakingTimeSeconds: { type: Number, default: 0 },
  attentionScore: { type: Number, default: 0 },
  joinedAt: Date,
  leftAt: Date
});

const integrationStatusSchema = new mongoose.Schema({
  notion: { type: String, enum: ['pending', 'done', 'failed', 'skipped'], default: 'pending' },
  slack: { type: String, enum: ['pending', 'done', 'failed', 'skipped'], default: 'pending' },
  jira: { type: String, enum: ['pending', 'done', 'failed', 'skipped'], default: 'pending' },
  gmail: { type: String, enum: ['pending', 'done', 'failed', 'skipped'], default: 'pending' },
  gcalendar: { type: String, enum: ['pending', 'done', 'failed', 'skipped'], default: 'pending' },
  github: { type: String, enum: ['pending', 'done', 'failed', 'skipped'], default: 'pending' },
  salesforce: { type: String, enum: ['pending', 'done', 'failed', 'skipped'], default: 'pending' },
  asana: { type: String, enum: ['pending', 'done', 'failed', 'skipped'], default: 'pending' },
  gdrive: { type: String, enum: ['pending', 'done', 'failed', 'skipped'], default: 'pending' }
});

const meetingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: String,
  platform: { type: String, enum: ['google-meet', 'zoom', 'teams', 'other'], default: 'other' },
  meetingUrl: String,
  startTime: { type: Date, required: true },
  endTime: Date,
  duration: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'processing', 'completed'], default: 'active' },
  participants: [participantSchema],
  summary: String,
  keyDecisions: [String],
  actionItems: [actionItemSchema],
  topics: [String],
  sentiment: { type: String, enum: ['positive', 'neutral', 'negative'] },
  language: String,
  meetingCost: { type: Number, default: 0 },
  integrationStatus: { type: integrationStatusSchema, default: () => ({}) },
  notionPageUrl: String,
  notionPageId: String,
  notionError: String,
  recordingUrl: String,
  createdAt: { type: Date, default: Date.now }
});

meetingSchema.index({ userId: 1, createdAt: -1 });
meetingSchema.index({ status: 1 });
meetingSchema.index({ startTime: -1 });

module.exports = mongoose.model('Meeting', meetingSchema);