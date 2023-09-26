import rmsprocessorStr from './rmsprocessor.js?raw'

const loadableRMSProcessor = URL.createObjectURL(new Blob([rmsprocessorStr]))

export async function load(audioContext: AudioContext) {
  await audioContext.audioWorklet.addModule(loadableRMSProcessor)
}

/**
 * ex.
 *
 * const rms = new RMS()
 * fooAudioNode.connect(rms.input)
 *
 * Method 1. looking at internally updated value
 *
 * window.requestAnimationFrame(() => {
 *   console.log(rms.rms) // <-- this will be updated internally by RMS
 * })
 */
export class RMS {
  worklet: AudioWorkletNode
  value = 0

  constructor(audioContext: AudioContext) {
    try {
      this.worklet = new AudioWorkletNode(audioContext, 'rms')
      this.worklet.port.onmessage = this.#onmessage
      this.worklet.connect(audioContext.destination)
    } catch (err) {
      throw new Error('Must load rms processor before creating RMS nodes.')
    }
  }

  #onmessage({ data }) {
    this.value = data * 500
  }

  connect(node: AudioNode) {
    this.worklet.connect(node)
  }
}
