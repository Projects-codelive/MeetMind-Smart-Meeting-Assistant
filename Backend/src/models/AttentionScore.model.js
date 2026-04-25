const mongoose = require('mongoose');

const timelineEntrySchema = new mongoose.Schema({
  timestamp: Number,
  score: { type: Number, default: 0 },
  eyesOnScreen: { type: Boolean, default: false },
  expression: { type: String, enum: ['engaged', 'confused', 'distracted', 'nodding'] },
  headPose: {
    yaw: Number,
    pitch: Number,
    roll: Number
  }
});

const attentionScoreSchema = new mongoose.Schema({
  meetingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participantEmail: String,
  timeline: [timelineEntrySchema],
  overallScore: { type: Number, default: 0 },
  distractionCount: { type: Number, default: 0 },
  peakEngagementTime: Number,
  createdAt: { type: Date, default: Date.now }
});

attentionScoreSchema.index({ meetingId: 1, participantEmail: 1 });

module.exports = mongoose.model('AttentionScore', attentionScoreSchema);