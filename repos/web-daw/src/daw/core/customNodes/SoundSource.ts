import { IONode } from '../mixer'

export interface SoundSourceConstructorArgs {
  url?: string
  name?: string
}

/**
 * Wrap decodeAudioData to return promise.
 */
export function decodeAudioData(
  arrayBuffer: ArrayBuffer,
  audioContext: AudioContext
): Promise<AudioBuffer> {
  return new Promise((resolve, reject) => {
    audioContext.decodeAudioData(arrayBuffer, resolve, reject)
  })
}
/**
 * Wrap call to return promise.
 */
export function getBuffer(url: string): Promise<ArrayBuffer> {
  return new Promise(resolve => {
    const request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.responseType = 'arraybuffer'

    request.onload = () => {
      resolve(request.response)
    }
    request.send()
  })
}

export async function getAudioBuffer(url: string, audioContext: AudioContext) {
  const buffer = await getBuffer(url)
  return decodeAudioData(buffer, audioContext)
}

async function convertUrlToBlob(url: string) {
  // already blob
  if (url.startsWith('blob:')) {
    return url
  }
  const res = await fetch(`${url}`)
  const blob = await res.blob()
  const fileUrl = URL.createObjectURL(blob)
  return fileUrl
}

/*
 * A SoundSource encapsulates logic regarding the loading and playing of a
 * particular sound.
 *
 * This node does not expect inbound audio, it should only outbound. This node
 * should be an edge of an audio graph.
 *
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
export class SoundSource extends IONode {
  #audioContext: AudioContext

  name: string | undefined
  url: string | undefined
  audioBuffer: AudioBuffer | undefined
  // store buffer source for instance of sound playing
  bufferSources: AudioBufferSourceNode[]
  // function to call onended
  onended: () => void | undefined
  ready: boolean

  constructor(args: {
    audioContext: AudioContext
    name?: string
    url?: string
  }) {
    super(args.audioContext)

    this.#audioContext = args.audioContext
    this.ready = false
    if (args.url) {
      this.load(args.url, args.name)
    }
    this.bufferSources = []
  }

  /**
   * url to load sound for
   */
  async load(url: string, name?: string): Promise<void> {
    this.name = name
    this.ready = false
    this.emit('update')

    this.audioBuffer = undefined
    if (this.url !== url) {
      URL.revokeObjectURL(this.url)
    }
    this.url = url

    const blobUrl = await convertUrlToBlob(this.url)
    this.audioBuffer = await getAudioBuffer(blobUrl, this.#audioContext)
    this.ready = true

    this.emit('update')
  }

  unload() {
    if (this.url) {
      URL.revokeObjectURL(this.url)
    }
  }

  /**
   * offset - in seconds
   * oneShot - set to true if no parallel sounds desired, this
   * will stop currently playing sounds
   */
  play({
    startTime = 0,
    offset = 0,
    oneShot = false,
  }: {
    startTime?: number
    offset?: number
    oneShot?: boolean
  } = {}) {
    if (oneShot) {
      this.stop()
    }

    const bufferSource = this.#audioContext.createBufferSource()
    bufferSource.buffer = this.audioBuffer
    bufferSource.start(startTime, offset)
    bufferSource.connect(this.output)
    this.bufferSources.push(bufferSource)

    this.emit('update')

    bufferSource.onended = () => {
      this.bufferSources.shift()
      if (this.bufferSources.length === 0 && this.onended) {
        this.onended()
      }
    }
  }

  stop(when?: number) {
    let cursor = this.bufferSources.pop()
    while (cursor) {
      cursor.stop(when)
      cursor.disconnect(this.output)
      cursor = this.bufferSources.pop()
    }

    this.emit('update')
  }

  /**
   * Get stereo representation of the entire sound source.
   *
   * Array represents left(0) and right(1)
   */
  getChannelData(): Float32Array[] {
    if (!this.audioBuffer) return []
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
    for (let i = 0; i < buckets; i += 1) {
      let minLeft = 1
      let maxLeft = -1
      let minRight = 1
      let maxRight = -1
      for (let j = bucketSize * i; j < bucketSize * (i + 1); j += 1) {
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
