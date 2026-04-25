const mongoose = require('mongoose');

const integrationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  platform: {
    type: String,
    enum: ['notion', 'slack', 'gcalendar', 'gmail', 'jira', 'github', 'salesforce', 'asana', 'gdrive'],
    required: true
  },
  accessToken: String,
  refreshToken: String,
  tokenExpiry: Date,
  platformUserId: String,
  platformWorkspace: String,
  platformWorkspaceName: String,
  platformOwnerName: String,
  platformOwnerEmail: String,
  parentPageId: {
    type: String,
    description: 'Notion page ID where meeting pages will be created as children'
  },
  config: mongoose.Schema.Types.Mixed,
  isActive: { type: Boolean, default: true },
  lastUsed: Date,
  createdAt: { type: Date, default: Date.now }
});

integrationSchema.index({ userId: 1, platform: 1 }, { unique: true });

module.exports = mongoose.model('Integration', integrationSchema);