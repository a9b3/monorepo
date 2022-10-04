import { audioContext } from './audioContext'
import { Channel } from './Channel'

/**
 * A mixer is a collection of channel. Each channel is an audio output source,
 * they can be routed in a variety of ways forming an audio graph, but ultimate
 * they all converge to the master channel which outputs to the audio device.
 */
export class Mixer {
  id = crypto.randomUUID()
  audioContext: AudioContext = audioContext
  // Can have groups
  channels: { [id: string]: Channel } = {}
  sends: { [id: string]: Channel } = {}
  master: Channel = new Channel()

  constructor(arg?: any) {
    this.master.connect(audioContext.destination)
    if (arg) {
      this.fromJSON(arg)
    }
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

  toJSON() {
    return {
      id: this.id,
      channels: Object.values(this.channels).reduce((m, channel) => {
        m[channel.id] = channel.toJSON()
        return m
      }, {}),
      sends: Object.values(this.sends).reduce((m, channel) => {
        m[channel.id] = channel.toJSON()
        return m
      }, {}),
      master: this.master.toJSON(),
    }
  }

  fromJSON({ id, channels, sends, master }) {
    this.id = id
    Object.values(channels).map(channel => {
      this.addChannel(channel)
    })
    Object.values(sends).map(send => {
      this.addSend(send)
    })
    this.master.fromJSON(master)
  }
}
