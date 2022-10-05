import { ClipTrack } from './ClipTrack'
import { Arrangement } from './Arrangement'
import { MPC } from './instruments/MPC'

export class Track {
  id: string
  label: string
  color: string
  clipTrack = new ClipTrack()
  arrangement = new Arrangement()
  instrument: MPC
  /**
   * The channel that this track is connected to.
   */
  channelId: string

  constructor({ id, label, clipTrack, arrangement, channelId, color } = {}) {
    this.id = id ? id : crypto.randomUUID()

    // TODO default to this for now
    this.instrument = new MPC()

    this.color = color
    this.label = label
    this.clipTrack = new ClipTrack({
      ...clipTrack,
      instrument: this.instrument,
    })
    this.arrangement = new Arrangement()
    this.channelId = channelId
  }

  setLabel(label: string) {
    this.label = label
  }

  setColor(color: string) {
    this.color = color
  }

  handler = (...args) => {
    this.clipTrack.handler(...args)
  }
}
