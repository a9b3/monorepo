import { ClipTrack } from './ClipTrack'
import type { ClipTrackConstructorArgs } from './ClipTrack'
import { Arrangement } from './Arrangement'
import { MPC } from './instruments/MPC'
import type { MPCConstructorArgs } from './instruments/MPC'

interface TrackConstructorArgs {
  id?: string
  label?: string
  color?: string
  channelId?: string
  clipTrack?: ClipTrackConstructorArgs
  arrangement?: any
  instrument?: MPCConstructorArgs
}

export class Track {
  id: string = crypto.randomUUID()
  label: string
  color: string
  clipTrack = new ClipTrack()
  arrangement = new Arrangement()
  instrument: MPC
  /**
   * The channel that this track is connected to.
   */
  channelId: string

  constructor({
    id,
    label,
    clipTrack,
    channelId,
    instrument,
    color,
  }: TrackConstructorArgs) {
    if (id) this.id = id

    // TODO default to this for now
    this.instrument = new MPC(instrument)

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

  handler = (...args: any) => {
    this.clipTrack.handler(...args)
  }
}
