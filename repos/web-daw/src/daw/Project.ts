import { Mixer } from './Mixer'
import { Track } from './Track'
import { Controller } from './Controller'
import { SvelteStore } from 'src/utils/SvelteStore'

export class Project extends SvelteStore<Project> {
  // **************************
  // Persisted fields
  // **************************
  id: string
  createdAt?: number
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

  constructor(arg: any) {
    super()
    if (arg) {
      this.fromJSON(arg)
    }
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
    this.trackOrder = this.trackOrder.filter(id => id !== id)

    this.set(this)
  }

  toJSON() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      createdBy: this.createdBy,
      name: this.name,
      bpm: this.bpm,
      timeSignature: this.timeSignature,
      tracks: Object.values(this.tracks).reduce((m, track) => {
        m[track.id] = track.toJSON()
        return m
      }, {}),
      trackOrder: this.trackOrder,
    }
  }

  fromJSON({
    id,
    createdAt,
    createdBy,
    name,
    bpm,
    timeSignature,
    tracks,
    trackOrder,
  }) {
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

  cleanup() {
    this.mixer.cleanup()
  }
}
