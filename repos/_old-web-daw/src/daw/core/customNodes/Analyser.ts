import { RMS } from './RMS'

/*
 * This node does not output to anything. Connect to this node to get analyser
 * data from it.
 *
 * https://support.ircam.fr/docs/AudioSculpt/3.0/co/FFT%20Size.html
 */
export class Analyser {
  input: GainNode
  // stereo, analyser node for left and right
  analysers: [AnalyserNode, AnalyserNode]
  bufferLengths: [number, number]
  rms: RMS
  splitter: ChannelSplitterNode
  audioContext: AudioContext

  constructor(audioContext: AudioContext) {
    this.input = audioContext.createGain()
    this.audioContext = audioContext
    this.analysers = [
      audioContext.createAnalyser(),
      audioContext.createAnalyser(),
    ]
    this.rms = new RMS(audioContext)
    this.splitter = audioContext.createChannelSplitter()

    // ex.
    // this.splitter.connect(fooNode, 0, 0) <-- left signal
    // this.splitter.connect(fooNode, 1, 0) <-- right signal
    this.input.connect(this.splitter)

    this.byteFrequencies = []
    this.bufferLengths = []
    this.analysers.forEach((analyser, i) => {
      // https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/smoothingTimeConstant
      // value has to be 0 - 1 (0 meaning no time averaging) default is 0.8 if
      // not set
      analyser.smoothingTimeConstant = 0.9
      // power of 2
      // 1024 is 2^10
      analyser.fftSize = 1024

      this.bufferLengths[i] = analyser.frequencyBinCount
      this.byteFrequencies[i] = new Uint8Array(analyser.frequencyBinCount)

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
   * Inserts into byteFreuqencies poll from there
   */
  byteFrequencies: [Uint8Array, Uint8Array]
  getByteFrequencyData() {
    this.analysers.forEach((analyser, i) => {
      analyser.getByteFrequencyData(this.byteFrequencies[i])
    })
  }
  /**
   * https://stackoverflow.com/questions/4364823/how-do-i-obtain-the-frequencies-of-each-value-in-an-fft
   */
  getHz(channel: number, binIndex: number) {
    return (
      binIndex *
      (this.audioContext.sampleRate / this.analysers[channel].fftSize)
    )
  }

  getByteTimeDomainData() {
    return this.analysers.map(analyser => {
      const array = new Uint8Array(analyser.fftSize)
      analyser.getByteTimeDomainData(array)
      return array
    })
  }

  getFloatFrequencyData() {
    return this.analysers.map(analyser => {
      const array = new Float32Array(analyser.frequencyBinCount)
      analyser.getFloatFrequencyData(array)
      return array
    })
  }

  getFloatTimeDomainData() {
    return this.analysers.map(analyser => {
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
