const mongoose = require('mongoose');

const segmentSchema = new mongoose.Schema({
  speaker: String,
  speakerEmail: String,
  text: String,
  startTime: Number,
  endTime: Number,
  confidence: { type: Number, default: 0 },
  language: String,
  translatedText: String
});

const transcriptSchema = new mongoose.Schema({
  meetingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  segments: [segmentSchema],
  fullText: String,
  wordCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

transcriptSchema.index({ meetingId: 1 });
transcriptSchema.index({ userId: 1 });

module.exports = mongoose.model('Transcript', transcriptSchema);