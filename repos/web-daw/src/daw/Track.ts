import { ClipTrack } from './ClipTrack'
import { Arrangement } from './Arrangement'

export class Track {
  id: string
  label: string
  color: string
  clipTrack = new ClipTrack()
  arrangement = new Arrangement()
  /**
   * The channel that this track is connected to.
   */
  channelId: string

  constructor({ id, label, clipTrack, arrangement, channelId, color } = {}) {
    this.id = id ? id : crypto.randomUUID()
    this.color = color
    this.label = label
    this.clipTrack = new ClipTrack(clipTrack)
    this.arrangement = new Arrangement(arrangement)
    this.channelId = channelId
  }

  setLabel(label: string) {
    this.label = label
  }

  setColor(color: string) {
    this.color = color
  }
}
