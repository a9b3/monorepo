import { audioContext } from './audioContext'

function calcRmsAndPeak(arr: Float32Array) {
  let sum = 0
  let max = 0
  for (let i = 0; i < arr.length; i += 1) {
    // power of 2
    sum += arr[i] ** 2

    if (arr[i] > max) {
      max = arr[i]
    }
  }
  return {
    rms: Math.sqrt(sum / arr.length),
    peak: max,
  }
}

/*
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
  input: ScriptProcessorNode
  rms = [0, 0]
  peaks = [0, 0]
  smoothingConstant = 0.8

  constructor() {
    this.input = audioContext.createScriptProcessor(4096, 2, 2)
    this.input.connect(audioContext.destination)
    this.input.onaudioprocess = this.#onAudioProcess
  }

  #onAudioProcess = (e: AudioProcessingEvent) => {
    const inputs = [
      e.inputBuffer.getChannelData(0),
      e.inputBuffer.getChannelData(1),
    ]

    const rmsAndPeak = [calcRmsAndPeak(inputs[0]), calcRmsAndPeak(inputs[1])]

    const rms = [
      Math.max(rmsAndPeak[0].rms, this.rms[0] * this.smoothingConstant),
      Math.max(rmsAndPeak[1].rms, this.rms[1] * this.smoothingConstant),
    ]

    const peaks = [
      Math.max(rmsAndPeak[0].peak, this.peaks[0] * this.smoothingConstant),
      Math.max(rmsAndPeak[1].peak, this.peaks[1] * this.smoothingConstant),
    ]

    if (rms[0] !== this.rms[0] || rms[1] !== this.rms[1]) {
      this.rms = rms
    }

    if (peaks[0] !== this.peaks[0] || peaks[1] !== this.peaks[1]) {
      this.peaks = peaks
    }
  }
}
