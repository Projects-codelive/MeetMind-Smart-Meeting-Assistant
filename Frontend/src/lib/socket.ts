import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class SocketClient {
  private socket: Socket | null = null;

  connect() {
    if (this.socket?.connected) return;
    
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return this.socket;
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  startMeeting(data: { meetingId: string; userId: string; platform: string; meetingUrl?: string }) {
    this.socket?.emit('meeting:start', data);
  }

  endMeeting(meetingId: string) {
    this.socket?.emit('meeting:end', { meetingId });
  }

  sendAudioChunk(data: { meetingId: string; userId: string; chunk: string; timestamp: number }) {
    this.socket?.emit('audio:chunk', data);
  }

  sendAttentionFrame(data: { meetingId: string; participantEmail: string; frame: any }) {
    this.socket?.emit('attention:frame', data);
  }

  onTranscriptSegment(callback: (data: any) => void) {
    this.socket?.on('transcript:segment', callback);
  }

  onAttentionScore(callback: (data: any) => void) {
    this.socket?.on('attention:score', callback);
  }

  onMeetingSummary(callback: (data: any) => void) {
    this.socket?.on('meeting:summary', callback);
  }

  onMeetingActions(callback: (data: any) => void) {
    this.socket?.on('meeting:actions', callback);
  }

  onLateJoinerCatchup(callback: (data: any) => void) {
    this.socket?.on('latejoin:catchup', callback);
  }

  onError(callback: (data: { code: string; message: string }) => void) {
    this.socket?.on('error', callback);
  }
}

export const socketClient = new SocketClient();
export default socketClient;