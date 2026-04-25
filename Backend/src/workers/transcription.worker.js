const { Queue, Worker } = require('bullmq');
const { connectRedis } = require('../config/redis');
const transcriptionService = require('../services/transcription.service');

const connection = connectRedis();

const transcriptionQueue = new Queue('transcription', { connection });

const processTranscriptionJob = async (job) => {
  const { audioBuffer, meetingId, userId, timestamp } = job.data;
  
  const segment = await transcriptionService.processAudioChunk(
    audioBuffer,
    meetingId,
    userId,
    timestamp
  );
  
  await transcriptionService.saveTranscriptSegment(meetingId, userId, segment);
  
  return segment;
};

module.exports = {
  transcriptionQueue,
  processTranscriptionJob
};