class AudioProcessorWorklet extends AudioWorkletProcessor {
  constructor() {
    super();
    this.port.onmessage = (event) => {
      if (event.data === 'stop') {
        this.port.close();
      }
    };
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input && input.length > 0) {
      const channelData = input[0];
      const samples = new Float32Array(channelData.length);
      samples.set(channelData);

      this.port.postMessage({
        type: 'audio',
        samples: samples,
        timestamp: performance.now()
      });
    }
    return true;
  }
}

registerProcessor('audio-processor', AudioProcessorWorklet);