import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

class MeetingStore {
  private socket: any = null;
  private meetingId: string | null = null;
  private userId: string | null = null;
  private isRecording = false;
  private startTime: number = 0;

  constructor() {
    this.connect();
  }

  connect() {
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to MeetMind server');
    });

    this.socket.on('transcript:segment', (data: any) => {
      this.updateTranscript(data);
    });

    this.socket.on('attention:score', (data: any) => {
      this.updateAttentionScore(data);
    });

    this.socket.on('meeting:summary', (data: any) => {
      console.log('Meeting summary:', data.summary);
    });
  }

  async startMeeting(platform: string, meetingUrl?: string) {
    if (this.isRecording) return;

    const response = await fetch('/api/meetings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: this.detectMeetingTitle(),
        platform,
        meetingUrl,
        startTime: new Date().toISOString(),
      }),
    });

    const meeting = await response.json();
    this.meetingId = meeting._id;
    this.isRecording = true;
    this.startTime = Date.now();

    this.socket?.emit('meeting:start', {
      meetingId: this.meetingId,
      platform,
      meetingUrl,
    });

    this.showConsentBanner();
  }

  stopMeeting() {
    if (!this.isRecording) return;

    this.socket?.emit('meeting:end', { meetingId: this.meetingId });
    
    this.isRecording = false;
  }

  sendAttentionFrame(frameData: any) {
    if (!this.isRecording || !this.meetingId) return;

    this.socket?.emit('attention:frame', {
      meetingId: this.meetingId,
      participantEmail: this.userId,
      frame: frameData,
    });
  }

  askQuestion(question: string) {
    return new Promise((resolve, reject) => {
      if (!this.meetingId) {
        reject(new Error('No active meeting'));
        return;
      }

      this.socket?.emit('meeting:qa', {
        meetingId: this.meetingId,
        question,
      });

      this.socket?.on('meeting:answer', (data: any) => {
        resolve(data.answer);
      });

      this.socket?.on('error', (error: any) => {
        reject(error);
      });
    });
  }

  private detectMeetingTitle(): string {
    const title = document.title;
    return title.replace(/ - Google Meet|- Zoom| - Microsoft Teams/g, '').trim();
  }

  private updateTranscript(segment: any) {
    const container = document.getElementById('meetmind-transcript');
    if (container) {
      const element = document.createElement('div');
      element.className = 'meetmind-segment';
      element.innerHTML = `<strong>${segment.speaker}:</strong> ${segment.text}`;
      container.appendChild(element);
      container.scrollTop = container.scrollHeight;
    }
  }

  private updateAttentionScore(data: any) {
    const scoreElement = document.getElementById('meetmind-attention-score');
    if (scoreElement) {
      scoreElement.textContent = `${data.score}%`;
      scoreElement.style.color = data.score >= 80 ? 'green' : data.score >= 50 ? 'yellow' : 'red';
    }
  }

  private showConsentBanner() {
    const banner = document.createElement('div');
    banner.id = 'meetmind-consent';
    banner.innerHTML = `
      <div style="padding: 12px; background: #f0f0f0; border-bottom: 1px solid #ccc; display: flex; align-items: center; justify-content: space-between;">
        <span>🎙️ MeetMind is recording this meeting. <a href="#" style="color: blue;">Privacy Policy</a></span>
        <button id="meetmind-consent-btn" style="padding: 6px 12px; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer;">OK</button>
      </div>
    `;
    document.body.appendChild(banner);

    document.getElementById('meetmind-consent-btn')?.addEventListener('click', () => {
      banner.remove();
    });
  }
}

export default MeetingStore;