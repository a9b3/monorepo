/*
 * SoundSource ex.
 *
 * const soundSource = new SoundSource()
 *
 * // raw audio node
 * soundSource.outputNode.connect(audioContext.destination)
 * // another unit
 * soundSource.connect(unitNode)
 *
 * await soundSource.load(url)
 * soundSource.play()
 */
import type { UnitInterface } from './UnitInterface'
import { audioContext } from './audioContext'
import { getAudioBuffer } from './utils/getAudioBuffer'

export interface SoundSourceConstructorArgs {
  url?: string
}

/*
 * A SoundSource encapsulates logic regarding the loading and playing of a
 * particular sound.
 *
 * This node does not expect inbound audio, it should only outbound. This node
 * should be an edge of an audio graph.
 */
export class SoundSource {
  url: string
  audioBuffer: AudioBuffer
  // store buffer source for instance of sound playing
  bufferSources = []
  // function to call onended
  onended = () => {}
  ready = false
  output = audioContext.createGain()

  constructor(arg?: SoundSourceConstructorArgs) {
    if (arg.url) {
      this.url = arg.url
      this.load(this.url)
    }
  }

  connect(unit: UnitInterface | AudioNode) {
    this.output.connect(unit instanceof AudioNode ? unit : unit.input)
  }

  disconnect(unit?: UnitInterface | AudioNode) {
    if (unit) {
      this.output.disconnect(unit instanceof AudioNode ? unit : unit.input)
    } else {
      // TODO clean up sends here too
      this.output.disconnect()
    }
  }

  /**
   * url to load sound for
   */
  async load(url: string): Promise<void> {
    this.ready = false
    this.audioBuffer = undefined
    this.url = url

    this.audioBuffer = await getAudioBuffer(url)
    this.ready = true
  }

  /**
   * position - in seconds
   * oneShot - set to true if no parallel sounds desired, this
   * will stop currently playing sounds
   */
  play({
    startTime = 0,
    position = 0,
    oneShot = false,
  }: { startTime?: number; position?: number; oneShot?: boolean } = {}) {
    if (oneShot) {
      this.stop()
    }

    const bufferSource = audioContext.createBufferSource()
    bufferSource.buffer = this.audioBuffer
    bufferSource.start(startTime, position)
    bufferSource.connect(this.output)
    this.bufferSources.push(bufferSource)

    bufferSource.onended = () => {
      this.bufferSources.shift()
      if (this.bufferSources.length === 0) {
        this.onended()
      }
    }
  }

  stop(...args) {
    let cursor = this.bufferSources.pop()
    while (cursor) {
      cursor.stop(...args)
      cursor.disconnect(this.output)
      cursor = this.bufferSources.pop()
    }
  }

  /**
   * Get stereo representation of the entire sound source.
   *
   * Array represents left(0) and right(1)
   */
  getChannelData(): Float32Array[] {
    if (!this.audioBuffer) return
    return [
      this.audioBuffer.getChannelData(0),
      this.audioBuffer.getChannelData(1),
    ]
  }

  /**
   * Values range from -1 to 1.
   *
   * buckets - how many buckets to split data into
   * left and right represensations of min
   * and max
   */
  getWaveShape({ buckets = 100 }: { buckets?: number } = {}): {
    min: number
    max: number
  }[][] {
    if (!this.audioBuffer) return
    const channelData = this.getChannelData()
    const bucketSize = Math.round(channelData[0].length / buckets)

    const arr = []
    for (let i = 0; i < buckets; i++) {
      let minLeft = 1
      let maxLeft = -1
      let minRight = 1
      let maxRight = -1
      for (let j = bucketSize * i; j < bucketSize * (i + 1); j++) {
        const valueLeft = channelData[0][j]
        if (valueLeft < minLeft) minLeft = valueLeft
        if (valueLeft > maxLeft) maxLeft = valueLeft

        const valueRight = channelData[1][j]
        if (valueRight < minRight) minRight = valueRight
        if (valueRight > maxRight) maxRight = valueRight
      }
      arr.push([
        { min: minLeft, max: maxLeft },
        { min: minRight, max: maxRight },
      ])
    }
    return arr
  }
}
