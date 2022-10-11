import { RMS } from './RMS'

/*
 * This node does not output to anything. Connect to this node to get analyser
 * data from it.
 */
export class Analyser {
  input: GainNode
  // stereo, analyser node for left and right
  #analysers: [AnalyserNode, AnalyserNode]
  rms: RMS
  splitter: ChannelSplitterNode

  constructor(audioContext: AudioContext) {
    this.input = audioContext.createGain()
    this.#analysers = [
      audioContext.createAnalyser(),
      audioContext.createAnalyser(),
    ]
    this.rms = new RMS(audioContext)
    this.splitter = audioContext.createChannelSplitter()

    // ex.
    // this.splitter.connect(fooNode, 0, 0) <-- left signal
    // this.splitter.connect(fooNode, 1, 0) <-- right signal
    this.input.connect(this.splitter)

    this.#analysers.forEach((analyser, i) => {
      // https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/smoothingTimeConstant
      // value has to be 0 - 1 (0 meaning no time averaging) default is 0.8 if
      // not set
      analyser.smoothingTimeConstant = 0.8
      analyser.fftSize = 1024

      // connect stereo signals to individual analysers
      this.splitter.connect(analyser, i, 0)
    })

    this.input.connect(this.rms.input)
  }

  /**
   * Size of array is half of fftSize.
   * values range from 0 - 255
   *
   * return should be [left, right]
   */
  getByteFrequencyData(): Uint8Array[] {
    return this.#analysers.map(analyser => {
      const array = new Uint8Array(analyser.frequencyBinCount)
      analyser.getByteFrequencyData(array)
      return array
    })
  }

  getByteTimeDomainData() {
    return this.#analysers.map(analyser => {
      const array = new Uint8Array(analyser.fftSize)
      analyser.getByteTimeDomainData(array)
      return array
    })
  }

  getFloatFrequencyData() {
    return this.#analysers.map(analyser => {
      const array = new Float32Array(analyser.frequencyBinCount)
      analyser.getFloatFrequencyData(array)
      return array
    })
  }

  getFloatTimeDomainData() {
    return this.#analysers.map(analyser => {
      const array = new Float32Array(analyser.fftSize)
      analyser.getFloatTimeDomainData(array)
      return array
    })
  }

  getRms() {
    return this.rms.rms
  }

  getPeaks() {
    return this.rms.peaks
  }
}
