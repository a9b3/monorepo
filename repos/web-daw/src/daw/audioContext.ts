/**
 * Returns an instance of audio context.
 */
export function createAudioContext(): AudioContext {
  if (!(window.AudioContext || window.webkitAudioContext)) {
    throw new Error('Your browser does not have support for AudioContext')
  }

  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  return audioContext
}

export const audioContext = createAudioContext()
