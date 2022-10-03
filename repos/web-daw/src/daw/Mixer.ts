import { audioContext } from './audioContext'
import { Channel } from './Channel'

/**
 * A mixer is a collection of channel. Each channel is an audio output source,
 * they can be routed in a variety of ways forming an audio graph, but ultimate
 * they all converge to the master channel which outputs to the audio device.
 */
export class Mixer {
  audioContext: AudioContext = audioContext
  // Can have groups
  channels: Channel[] = []
  sends: Channel[] = []
  master: Channel = new Channel({ label: 'master' })

  constructor() {
    this.master.connect(audioContext.destination)
  }

  addChannel({ label }: { label?: string }) {
    const channel = new Channel({ label })
    channel.connect(this.master)
    this.channels.push(channel)
  }

  removeChannel(idx: number) {
    const channel = this.channels[idx]
    channel.disconnect()
    this.channels.splice(idx, 1)
  }
}
