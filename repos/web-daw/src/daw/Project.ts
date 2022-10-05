import { SvelteStore } from 'src/utils/SvelteStore'
import type { ProjectDoc } from 'src/database/project'
import { Mixer } from './Mixer'
import { Track } from './Track'
import { Controller } from './Controller'
import { audioContext } from './audioContext'

export class Project extends SvelteStore {
  id: string
  createdAt: number | undefined
  createdBy: string
  lastModified: number | undefined
  lastModifiedBy: string
  name = 'Untitled'
  bpm = 120
  ticksPerBeat = 480
  timeSignature: { top: number; bottom: number } = {
    top: 4,
    bottom: 4,
  }
  tracks: { [id: string]: Track } = {}
  trackOrder: string[] = []
  controller: Controller
  mixer: Mixer

  constructor({
    id,
    createdAt,
    createdBy,
    name,
    bpm,
    timeSignature,
    tracks,
    trackOrder,
    mixer,
    controller = new Controller({}),
  }: ProjectDoc) {
    super()

    this.id = id
    this.createdAt = createdAt
    this.createdBy = createdBy
    this.name = name
    this.bpm = bpm
    this.timeSignature = timeSignature
    this.trackOrder = trackOrder
    if (controller) this.controller = new Controller(controller)
    this.controller.addHandler(this.handler)
    this.mixer = new Mixer(mixer)
    this.tracks = Object.values(tracks).reduce((m, track) => {
      const _track = new Track(track)
      m[_track.id] = _track
      if (_track.channelId) {
        _track.instrument.connect(this.mixer.channels[_track.channelId])
      }
      return m
    }, {})
  }

  setName(name: string) {
    this.name = name

    this.updareSvelte(this)
  }

  addTrack({ label }: { label: string }) {
    const id = crypto.randomUUID()
    const channel = this.mixer.addChannel()
    const track = new Track({ id, channelId: channel.id, label })
    this.tracks[id] = track
    this.trackOrder.push(id)

    // TODO default to this for now
    track.instrument.connect(channel.input)

    this.updareSvelte(this)
  }

  removeTrack(id: string) {
    const track = this.tracks[id]
    this.mixer.removeChannel(track.channelId)
    delete this.tracks[id]
    this.trackOrder = this.trackOrder.filter(trackId => id !== trackId)

    this.updareSvelte(this)
  }

  cleanup() {
    this.mixer.cleanup()
  }

  handler = (...args) => {
    Object.values(this.tracks).forEach(track => {
      track.handler(...args)
    })
  }
}
