import { audioContext } from './audioContext'
import { Channel } from './Channel'
import type { ChannelConstructorArgs } from './Channel'

export interface MixerConstructorArgs {
  id?: string
  channels?: { [id: string]: ChannelConstructorArgs }
  sends?: { [id: string]: ChannelConstructorArgs }
  master?: ChannelConstructorArgs
}

/**
 * A mixer is a collection of channel. Each channel is an audio output source,
 * they can be routed in a variety of ways forming an audio graph, but ultimate
 * they all converge to the master channel which outputs to the audio device.
 */
export class Mixer {
  id: string
  // Can have groups
  channels: { [id: string]: Channel } = {}
  sends: { [id: string]: Channel } = {}
  master: Channel = new Channel()

  constructor({
    id = crypto.randomUUID(),
    channels,
    sends,
    master,
  }: MixerConstructorArgs = {}) {
    if (id) this.id = id
    if (master) this.master = new Channel(master)
    if (channels) {
      Object.values(channels).forEach(channelArgs => {
        this.addChannel(channelArgs)
      })
    }
    if (sends) {
      Object.values(sends).forEach(channelArgs => {
        this.addSend(channelArgs)
      })
    }

    this.master.connect(audioContext.destination)
  }

  addChannel(arg?: ChannelConstructorArgs): Channel {
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

  addSend(arg?: ChannelConstructorArgs): Channel {
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
