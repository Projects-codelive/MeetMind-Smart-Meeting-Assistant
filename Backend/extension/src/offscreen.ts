const SOCKET_URL = 'http://localhost:5000';

let mediaRecorder: MediaRecorder | null = null;
let isRecording = false;
let meetingId: string | null = null;
let socket: WebSocket | null = null;
let audioChunks: Blob[] = [];
let chunkInterval: number | null = null;
let token: string | null = null;

function connectSocket(authToken: string): WebSocket {
  const ws = new WebSocket(`${SOCKET_URL.replace('http', 'ws')}/extension`);

  ws.onopen = () => {
    console.log('WebSocket connected');
    ws.send(JSON.stringify({ type: 'auth', token: authToken }));
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'error') {
        console.error('Server error:', data.message);
        stopRecording();
      }
    } catch (e) {
      console.error('Failed to parse message:', e);
    }
  };

  ws.onclose = () => {
    console.log('WebSocket disconnected');
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return ws;
}

function emitAudioChunk(chunk: Blob, isFinal: boolean = false) {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    const base64 = (reader.result as string).split(',')[1];

    socket!.send(JSON.stringify({
      type: isFinal ? 'audio:final' : 'audio:chunk',
      meetingId,
      chunk: base64,
      timestamp: Date.now(),
      isFinal
    }));
  };
  reader.readAsDataURL(chunk);
}

async function startRecording(streamId: string, authToken: string, meetingIdParam: string) {
  if (isRecording) {
    console.log('Already recording');
    return;
  }

  try {
    token = authToken;
    meetingId = meetingIdParam;

    socket = connectSocket(token);

    await new Promise<void>((resolve, reject) => {
      if (!socket) return reject(new Error('No socket'));

      const timeout = setTimeout(() => reject(new Error('Socket connection timeout')), 5000);

      socket.onopen = () => {
        clearTimeout(timeout);
        resolve();
      };

      socket.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Socket connection error'));
      };
    });

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: 'tab',
          chromeMediaSourceId: streamId
        }
      }
    });

    if (!stream || stream.getAudioTracks().length === 0) {
      throw new Error('No audio track available');
    }

    isRecording = true;
    audioChunks = [];

    mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm;codecs=opus',
      audioBitsPerSecond: 128000
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
        emitAudioChunk(event.data, false);
      }
    };

    mediaRecorder.start(1000);

    chunkInterval = setInterval(() => {
      if (mediaRecorder?.state === 'recording') {
        mediaRecorder.requestData();
      }
    }, 30000);

    console.log('Offscreen recording started:', meetingId);

  } catch (error) {
    console.error('Failed to start recording:', error);
  }
}

async function stopRecording() {
  if (!isRecording) return;

  try {
    isRecording = false;

    if (chunkInterval) {
      clearInterval(chunkInterval);
      chunkInterval = null;
    }

    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.requestData();
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      mediaRecorder = null;
    }

    if (audioChunks.length > 0) {
      const finalChunk = new Blob(audioChunks, { type: 'audio/webm' });
      emitAudioChunk(finalChunk, true);
    }

    if (socket) {
      socket.send(JSON.stringify({
        type: 'meeting:end',
        meetingId
      }));
      socket.close();
      socket = null;
    }

    meetingId = null;
    audioChunks = [];

    console.log('Offscreen recording stopped');

  } catch (error) {
    console.error('Failed to stop recording:', error);
  }
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'START_OFFSCREEN') {
    startRecording(message.streamId, message.token, message.meetingId);
  } else if (message.type === 'STOP_OFFSCREEN') {
    stopRecording();
  }
});