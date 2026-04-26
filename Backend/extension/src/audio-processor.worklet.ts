class AudioProcessorWorklet extends AudioWorkletProcessor {
  private isProcessing = true;

  constructor() {
    super();
    this.port.onmessage = (event) => {
      if (event.data === 'stop') {
        this.isProcessing = false;
      }
    };
  }

  process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean {
    if (!this.isProcessing) {
      return false;
    }

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