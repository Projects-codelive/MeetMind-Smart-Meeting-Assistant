const { z } = require('zod');

const createMeetingSchema = z.object({
  title: z.string().optional(),
  platform: z.enum(['google-meet', 'zoom', 'teams', 'other']).optional(),
  meetingUrl: z.string().url().optional(),
  startTime: z.string().datetime().optional()
});

const updateMeetingSchema = z.object({
  title: z.string().optional(),
  status: z.enum(['active', 'processing', 'completed']).optional(),
  endTime: z.string().datetime().optional()
});

const updateActionItemSchema = z.object({
  status: z.enum(['pending', 'done'])
});

const askQuestionSchema = z.object({
  meetingId: z.string(),
  question: z.string().min(1).max(500)
});

const createIntegrationSchema = z.object({
  platform: z.string(),
  code: z.string()
});

module.exports = {
  createMeetingSchema,
  updateMeetingSchema,
  updateActionItemSchema,
  askQuestionSchema,
  createIntegrationSchema
};