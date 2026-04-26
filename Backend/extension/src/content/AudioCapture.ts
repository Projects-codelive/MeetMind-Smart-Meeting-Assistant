let isCapturing = false;
let audioContext: AudioContext | null = null;
let audioWorkletNode: AudioWorkletNode | null = null;

async function start() {
  if (isCapturing) return;
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    audioContext = new AudioContext();
    await audioContext.audioWorklet.addModule(chrome.runtime.getURL('/audio-processor.worklet.js'));

    audioWorkletNode = new AudioWorkletNode(audioContext, 'audio-processor', {
      numberOfInputs: 1,
      numberOfOutputs: 0,
      channelCount: 1,
    });

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(audioWorkletNode);

    audioWorkletNode.port.onmessage = async (event) => {
      if (!isCapturing) return;
      
      if (event.data.type === 'audio') {
        const { samples, timestamp } = event.data;
        
        const wavBlob = pcmToWav(samples, audioContext!.sampleRate);
        
        chrome.runtime.sendMessage({
          type: 'AUDIO_CHUNK',
          audio: await blobToBase64(wavBlob),
          timestamp: Date.now(),
        });
      }
    };

    isCapturing = true;
    console.log('Audio capture active');
  } catch (error) {
    console.error('Failed to start audio capture:', error);
    throw error;
  }
}

function stop() {
  isCapturing = false;
  
  if (audioWorkletNode) {
    audioWorkletNode.port.postMessage('stop');
    audioWorkletNode.disconnect();
    audioWorkletNode = null;
  }
  
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
  
  console.log('Audio capture stopped');
}

function pcmToWav(samples: Float32Array, sampleRate: number): Blob {
  const numChannels = 1;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = numChannels * bytesPerSample;
  
  const dataLength = samples.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);
  
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, 'data');
  view.setUint32(40, dataLength, true);
  
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const sample = samples[i] < 0 
      ? samples[i] * 0x8000 
      : samples[i] * 0x7FFF;
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
    offset += 2;
  }
  
  return new Blob([buffer], { type: 'audio/wav' });
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'START_CAPTURE') {
    start()
      .then(() => sendResponse({ success: true }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  } else if (message.type === 'STOP_CAPTURE') {
    stop();
    sendResponse({ success: true });
  } else if (message.type === 'GET_CAPTURE_STATUS') {
    sendResponse({ isCapturing });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ATTENTION_FRAME') {
    chrome.runtime.sendMessage({
      type: 'ATTENTION_DATA',
      meetingId: message.meetingId,
      frame: message.frame,
      timestamp: message.timestamp
    }, (response) => {
      sendResponse(response);
    });
    return true;
  }
});