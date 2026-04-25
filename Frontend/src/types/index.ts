export interface User {
  _id: string;
  clerkId: string;
  email: string;
  name?: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'enterprise';
  meetingsCount: number;
  connectedIntegrations: string[];
  settings: {
    language: string;
    autoSummary: boolean;
    attentionTracking: boolean;
    preMeetingBriefing: boolean;
    notificationEmail: boolean;
  };
  createdAt: string;
}

export interface Meeting {
  _id: string;
  userId: string;
  title: string;
  platform: 'google-meet' | 'zoom' | 'teams' | 'other';
  meetingUrl?: string;
  startTime: string;
  endTime?: string;
  duration: number;
  status: 'active' | 'processing' | 'completed';
  participants: Participant[];
  summary?: string;
  keyDecisions: string[];
  actionItems: ActionItem[];
  topics: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
  language?: string;
  meetingCost: number;
  integrationStatus: IntegrationStatus;
  recordingUrl?: string;
  createdAt: string;
}

export interface Participant {
  name?: string;
  email?: string;
  speakingTimeSeconds: number;
  attentionScore: number;
  joinedAt?: string;
  leftAt?: string;
}

export interface ActionItem {
  _id: string;
  task: string;
  assignee?: string;
  dueDate?: string;
  status: 'pending' | 'done';
}

export interface IntegrationStatus {
  notion: 'pending' | 'done' | 'failed' | 'skipped';
  slack: 'pending' | 'done' | 'failed' | 'skipped';
  jira: 'pending' | 'done' | 'failed' | 'skipped';
  gmail: 'pending' | 'done' | 'failed' | 'skipped';
  gcalendar: 'pending' | 'done' | 'failed' | 'skipped';
  github: 'pending' | 'done' | 'failed' | 'skipped';
  salesforce: 'pending' | 'done' | 'failed' | 'skipped';
  asana: 'pending' | 'done' | 'failed' | 'skipped';
  gdrive: 'pending' | 'done' | 'failed' | 'skipped';
}

export interface Transcript {
  _id: string;
  meetingId: string;
  userId: string;
  segments: TranscriptSegment[];
  fullText: string;
  wordCount: number;
  createdAt: string;
}

export interface TranscriptSegment {
  speaker: string;
  speakerEmail?: string;
  text: string;
  startTime: number;
  endTime: number;
  confidence: number;
  language?: string;
  translatedText?: string;
}

export interface AttentionScore {
  _id: string;
  meetingId: string;
  userId: string;
  participantEmail: string;
  timeline: AttentionFrame[];
  overallScore: number;
  distractionCount: number;
  peakEngagementTime: number;
  createdAt: string;
}

export interface AttentionFrame {
  timestamp: number;
  score: number;
  eyesOnScreen: boolean;
  expression: 'engaged' | 'confused' | 'distracted' | 'nodding';
  headPose: {
    yaw: number;
    pitch: number;
    roll: number;
  };
}

export interface Integration {
  _id: string;
  userId: string;
  platform: string;
  isActive: boolean;
  lastUsed?: string;
  createdAt: string;
}

export interface AnalyticsOverview {
  totalMeetings: number;
  avgAttentionScore: number;
  actionItemsCreated: number;
  byPlatform: Record<string, number>;
}