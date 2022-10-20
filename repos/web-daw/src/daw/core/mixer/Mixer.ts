import { Subscribable } from '../ui/Subscribable'
import { Channel } from './Channel'

/**
 * A mixer is a collection of channel. Each channel is an audio output source,
 * they can be routed in a variety of ways forming an audio graph, but
 * ultimately they all converge to the master channel which outputs to the
 * audio device.
 */
export class Mixer extends Subscribable {
  #audioContext: AudioContext
  // Can have groups
  channels: { [id: string]: Channel } = {}
  sends: { [id: string]: Channel } = {}
  master: Channel

  constructor(args: {
    audioContext: AudioContext
    channels?: {
      [id: string]: Omit<
        ConstructorParameters<typeof Channel>[0],
        'audioContext'
      >
    }
    sends?: {
      [id: string]: Omit<
        ConstructorParameters<typeof Channel>[0],
        'audioContext'
      >
    }
    master?: Omit<ConstructorParameters<typeof Channel>[0], 'audioContext'>
  }) {
    super()

    this.#audioContext = args.audioContext
    this.master = new Channel({
      ...args.master,
      audioContext: args.audioContext,
    })
    this.channels = {}
    this.sends = {}

    if (args.channels) {
      Object.values(args.channels).forEach(channelArgs => {
        this.addChannel({ ...channelArgs, audioContext: args.audioContext })
      })
    }
    if (args.sends) {
      Object.values(args.sends).forEach(channelArgs => {
        this.addSend({ ...channelArgs, audioContext: args.audioContext })
      })
    }

    this.turnon()
  }

  #channelSolo = (id: string, soloState: boolean) => {
    Object.keys(this.channels).forEach(cid => {
      if (cid === id) {
        this.channels[cid].setIsMute(false)
      }
      if (cid !== id) {
        this.channels[cid].setIsSolo(false, true)
        this.channels[cid].setIsMute(soloState)
      }
    })
  }

  addChannel(arg: ConstructorParameters<typeof Channel>[0]): Channel {
    const channel = new Channel(arg)
    channel.connect(this.master)
    channel.on('solo', this.#channelSolo)
    this.channels[channel.id] = channel

    this.emit('update')

    return channel
  }

  removeChannel(id: string) {
    const channel = this.channels[id]
    channel.removeListener('solo', this.#channelSolo)
    channel.disconnect()

    delete this.channels[id]

    this.emit('update')
  }

  addSend(arg?: ConstructorParameters<typeof Channel>[0]): Channel {
    const channel = new Channel(arg)
    channel.connect(this.master)
    this.sends[channel.id] = channel

    this.emit('update')

    return channel
  }

  removeSend(id: string) {
    const channel = this.sends[id]
    channel.disconnect()
    delete this.sends[id]

    this.emit('update')
  }

  shutdown() {
    this.master.disconnect()

    this.emit('update')
  }

  turnon() {
    this.master.connect(this.#audioContext.destination)

    this.emit('update')
  }
}
