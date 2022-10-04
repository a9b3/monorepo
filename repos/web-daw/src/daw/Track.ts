import { ClipTrack } from './ClipTrack'
import { Arrangement } from './Arrangement'

export class Track {
  id: string
  label: string
  clipTrack = new ClipTrack()
  arrangement = new Arrangement()
  /**
   * The channel that this track is connected to.
   */
  channelId: string

  constructor(arg?: any) {
    if (arg) {
      this.fromJSON(arg)
    }
  }

  toJSON() {
    return {
      id: this.id,
      label: this.label,
      clipTrack: this.clipTrack.toJSON(),
      arrangement: this.arrangement.toJSON(),
      channelId: this.channelId,
    }
  }

  fromJSON({ id, label, clipTrack, arrangement, channelId }) {
    this.id = id ? id : crypto.randomUUID()
    this.label = label
    this.clipTrack.fromJSON(clipTrack)
    this.arrangement.fromJSON(arrangement)
    this.channelId = channelId
  }
}
