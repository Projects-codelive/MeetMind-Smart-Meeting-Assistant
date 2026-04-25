const { Server } = require('socket.io');
const { connectRedis } = require('../config/redis');
const transcriptionService = require('../services/transcription.service');
const attentionService = require('../services/attention.service');
const aiService = require('../services/ai.service');
const Meeting = require('../models/Meeting.model');

let io;
let redis;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || '*',
      methods: ['GET', 'POST']
    }
  });

  redis = connectRedis();

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('meeting:start', async (data) => {
      try {
        const { meetingId, userId, platform, meetingUrl } = data;
        
        socket.join(meetingId);
        
        const meeting = await Meeting.findById(meetingId);
        if (meeting) {
          meeting.status = 'active';
          await meeting.save();
        }

        socket.emit('meeting:started', { meetingId });
      } catch (error) {
        console.error('Meeting Start Error:', error);
        socket.emit('error', { code: 'MEETING_START_ERROR', message: error.message });
      }
    });

    socket.on('meeting:end', async (data) => {
      try {
        const { meetingId } = data;
        
        socket.leave(meetingId);
        
        const meeting = await Meeting.findById(meetingId);
        if (meeting) {
          meeting.status = 'processing';
          meeting.endTime = new Date();
          meeting.duration = Math.floor((meeting.endTime - meeting.startTime) / 1000);
          await meeting.save();
        }

        socket.emit('meeting:ended', { meetingId });
      } catch (error) {
        console.error('Meeting End Error:', error);
        socket.emit('error', { code: 'MEETING_END_ERROR', message: error.message });
      }
    });

    socket.on('audio:chunk', async (data) => {
      try {
        const { meetingId, chunk, timestamp } = data;
        
        const segment = await transcriptionService.processAudioChunk(
          Buffer.from(chunk, 'base64'),
          meetingId,
          data.userId,
          timestamp
        );

        await transcriptionService.saveTranscriptSegment(
          meetingId,
          data.userId,
          segment
        );

        io.to(meetingId).emit('transcript:segment', segment);
      } catch (error) {
        console.error('Audio Chunk Error:', error);
      }
    });

    socket.on('attention:frame', async (data) => {
      try {
        const { meetingId, frame, participantEmail } = data;
        
        const attention = await attentionService.processAttentionFrame(
          frame,
          meetingId,
          participantEmail
        );

        io.to(meetingId).emit('attention:score', {
          participantEmail,
          score: attention.score,
          expression: attention.expression
        });
      } catch (error) {
        console.error('Attention Frame Error:', error);
      }
    });

    socket.on('participant:join', async (data) => {
      try {
        const { meetingId, name, email, timestamp } = data;
        
        const meeting = await Meeting.findById(meetingId);
        if (meeting) {
          meeting.participants.push({ name, email, joinedAt: new Date() });
          await meeting.save();
        }

        io.to(meetingId).emit('participant:joined', { name, email });
      } catch (error) {
        console.error('Participant Join Error:', error);
      }
    });

    socket.on('participant:late', async (data) => {
      try {
        const { meetingId, email, joinTimestamp } = data;
        
        const transcript = await transcriptionService.buildFullTranscript(meetingId);
        
        if (transcript?.fullText) {
          const summary = await aiService.generateLateJoinerSummary(
            transcript.fullText,
            Math.floor(joinTimestamp / 60)
          );

          socket.emit('latejoin:catchup', { summary });
        }
      } catch (error) {
        console.error('Late Joiner Error:', error);
      }
    });

    socket.on('meeting:qa', async (data) => {
      try {
        const { meetingId, question } = data;
        
        const transcript = await transcriptionService.buildFullTranscript(meetingId);
        
        if (transcript?.fullText) {
          const answer = await aiService.answerQuestion(
            transcript.fullText,
            question
          );

          socket.emit('meeting:answer', { answer });
        }
      } catch (error) {
        console.error('Q&A Error:', error);
        socket.emit('error', { code: 'QA_ERROR', message: error.message });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => io;

module.exports = {
  initializeSocket,
  getIO
};