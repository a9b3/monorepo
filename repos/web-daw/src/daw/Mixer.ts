import { audioContext } from './audioContext'
import { Channel } from './Channel'

/**
 * A mixer is a collection of channel. Each channel is an audio output source,
 * they can be routed in a variety of ways forming an audio graph, but ultimate
 * they all converge to the master channel which outputs to the audio device.
 */
export class Mixer {
  id = crypto.randomUUID()
  // Can have groups
  channels: { [id: string]: Channel } = {}
  sends: { [id: string]: Channel } = {}
  master: Channel = new Channel()

  constructor({ id, channels, sends, master }: any = {}) {
    if (master) {
      this.id = id
      this.channels = Object.values(channels).reduce((m, val) => {
        m[val.id] = new Channel(val)
        return m
      }, {} as { [id: string]: Channel })
      this.master = new Channel(master)
    }

    this.master.connect(audioContext.destination)
  }

  addChannel(arg?: any): Channel {
    const channel = new Channel(arg)
    channel.connect(this.master)
    this.channels[channel.id] = channel
    return channel
  }

  removeChannel(id: string) {
    const channel = this.channels[id]
    channel.disconnect()
    delete this.channels[id]
  }

  addSend(arg?: any): Channel {
    const channel = new Channel(arg)
    channel.connect(this.master)
    this.sends[channel.id] = channel
    return channel
  }

  removeSend(id: string) {
    const channel = this.sends[id]
    channel.disconnect()
    delete this.sends[id]
  }

  cleanup() {
    this.master.disconnect()
  }
}
