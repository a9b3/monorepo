import { SvelteStore } from 'src/utils/SvelteStore'
import type { ProjectDoc } from 'src/database/project'
import { Mixer } from './Mixer'
import { Track } from './Track'
import { Controller } from './Controller'

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
    controller,
  }: ProjectDoc) {
    super()

    this.id = id
    this.createdAt = createdAt
    this.createdBy = createdBy
    this.name = name
    this.bpm = bpm
    this.timeSignature = timeSignature
    this.tracks = Object.values(tracks).reduce((m, track) => {
      m[track.id] = new Track(track)
      return m
    }, {})
    this.trackOrder = trackOrder
    this.controller = new Controller(controller)
    this.mixer = new Mixer(mixer)
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
}
