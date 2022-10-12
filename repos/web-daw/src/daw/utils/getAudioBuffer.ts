import { audioContext } from 'daw/audioContext'

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

/**
 * Wrap decodeAudioData to return promise.
 */
export function decodeAudioData(
  arrayBuffer: ArrayBuffer
): Promise<AudioBuffer> {
  return new Promise((resolve, reject) => {
    audioContext.decodeAudioData(arrayBuffer, resolve, reject)
  })
}

export async function getAudioBuffer(url: string) {
  const buffer = await getBuffer(url)
  return decodeAudioData(buffer)
}
