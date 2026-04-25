const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: String,
  avatar: String,
  plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
  meetingsCount: { type: Number, default: 0 },
  connectedIntegrations: [String],
  settings: {
    language: { type: String, default: 'en' },
    autoSummary: { type: Boolean, default: true },
    attentionTracking: { type: Boolean, default: true },
    preMeetingBriefing: { type: Boolean, default: true },
    notificationEmail: { type: Boolean, default: true }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);