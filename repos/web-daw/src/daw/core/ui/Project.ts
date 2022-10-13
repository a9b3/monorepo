import { Mixer } from 'daw/core/mixer'

import { Subscribable } from './Subscribable'
import { Track } from './Track'
import { Controller } from './Controller'

export class Project extends Subscribable {
  #audioContext: AudioContext
  id: string
  createdAt: number | undefined
  createdBy: string | undefined
  lastModified: number | undefined
  lastModifiedBy: string | undefined
  name: string
  color: string | undefined
  emoji: string | undefined

  tracks: Track[]
  controller: Controller
  mixer: Mixer

  constructor(args: {
    audioContext: AudioContext
    id: string
    createdAt?: number
    createdBy?: string
    lastModified?: number
    lastModifiedBy?: string
    name?: string
    emoji?: string
    color?: string
    controller: Omit<
      ConstructorParameters<typeof Controller>[0],
      'audioContext'
    >
    mixer?: Omit<ConstructorParameters<typeof Mixer>[0], 'audioContext'>
    tracks?: Omit<ConstructorParameters<typeof Track>[0], 'audioContext'>[]
  }) {
    super()

    this.#audioContext = args.audioContext
    this.id = args.id
    this.createdAt = args.createdAt || Date.now()
    this.createdBy = args.createdBy
    this.lastModified = args.lastModified || Date.now()
    this.lastModifiedBy = args.lastModifiedBy
    this.name = args.name || 'Untitled'
    this.emoji = args.emoji
    this.color = args.color

    this.controller = new Controller({
      ...(args.controller || {}),
      audioContext: args.audioContext,
    })
    this.mixer = new Mixer({
      ...(args.mixer || {}),
      audioContext: args.audioContext,
    })
    this.tracks = []
    if (args.tracks) {
      args.tracks.forEach(trackArgs => {
        this.addTrack(trackArgs)
      })
    }
  }

  addTrack(
    trackArgs: Omit<ConstructorParameters<typeof Track>[0], 'audioContext'> & {
      id?: string
    }
  ) {
    const channelId =
      trackArgs.channelId ||
      this.mixer.addChannel({
        audioContext: this.#audioContext,
        id: crypto.randomUUID(),
      }).id
    const trackId = trackArgs.id || crypto.randomUUID()
    const track = new Track({
      ...trackArgs,
      id: trackId,
      channelId,
      audioContext: this.#audioContext,
    })
    this.controller.scheduler.on('tick', track.onTick)
    this.controller.on('stop', track.onStop)
    this.tracks.push(track)
    track.output.connect(this.mixer.channels[channelId].input)

    this.emit('update')
  }

  removeTrack(id: string) {
    const track = this.tracks.find(t => t.id === id)
    this.mixer.removeChannel(track.channelId)
    this.tracks = this.tracks.filter(t => t.id !== id)

    this.emit('update')
  }

  turnon() {
    this.mixer.turnon()

    this.emit('update')
  }

  shutdown() {
    this.mixer.shutdown()
    this.controller.stop()

    this.emit('update')
  }

  setName(name: string) {
    this.name = name

    this.emit('update')
  }
}
