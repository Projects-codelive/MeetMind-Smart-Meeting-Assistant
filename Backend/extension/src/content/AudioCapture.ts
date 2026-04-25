class AudioCapture {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private isCapturing = false;
  private meetingId: string | null = null;
  private socket: any = null;
  private startTime: number = 0;

  constructor(socket: any) {
    this.socket = socket;
  }

  async startCapture(meetingId: string) {
    if (this.isCapturing) {
      console.log('Already capturing');
      return;
    }

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      this.audioContext = new AudioContext();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (e) => {
        if (!this.isCapturing) return;
        
        const audioData = e.inputBuffer.getChannelData(0);
        const base64 = this.arrayBufferToBase64(audioData.buffer);
        
        this.socket?.emit('audio:chunk', {
          meetingId: this.meetingId,
          chunk: base64,
          timestamp: Math.floor((Date.now() - this.startTime) / 1000),
        });
      };

      source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
      
      this.meetingId = meetingId;
      this.isCapturing = true;
      this.startTime = Date.now();
      
      console.log('Audio capture started');
    } catch (error) {
      console.error('Audio capture error:', error);
      throw error;
    }
  }

  stopCapture() {
    if (!this.isCapturing) return;

    this.isCapturing = false;

    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.socket?.emit('meeting:end', { meetingId: this.meetingId });
    
    console.log('Audio capture stopped');
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  isActive(): boolean {
    return this.isCapturing;
  }
}

export default AudioCapture;