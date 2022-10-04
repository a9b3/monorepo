import { SvelteStore } from 'src/utils/SvelteStore'
import { Mixer } from './Mixer'
import { Track } from './Track'
import { Controller } from './Controller'

export class Project extends SvelteStore {
  id: string
  createdAt: number | undefined
  createdBy: string
  name = 'Untitled'
  bpm = 120
  timeSignature: { top: number; bottom: number } = {
    top: 4,
    bottom: 4,
  }
  tracks: { [id: string]: Track } = {}
  trackOrder: string[] = []
  controller: Controller = new Controller()
  mixer: Mixer = new Mixer()

  constructor({
    id,
    createdAt,
    createdBy,
    name,
    bpm,
    timeSignature,
    tracks,
    trackOrder,
  }) {
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
  }

  addTrack({ label }: { label: string }) {
    const id = crypto.randomUUID()
    const channel = this.mixer.addChannel()
    const track = new Track({ id, channelId: channel.id, label })
    this.tracks[id] = track
    this.trackOrder.push(id)

    this.set(this)
  }

  removeTrack(id: string) {
    const track = this.tracks[id]
    this.mixer.removeChannel(track.channelId)
    delete this.tracks[id]
    this.trackOrder = this.trackOrder.filter(trackId => id !== trackId)

    this.set(this)
  }

  cleanup() {
    this.mixer.cleanup()
  }
}