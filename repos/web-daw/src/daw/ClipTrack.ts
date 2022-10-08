import { SvelteStore } from 'src/utils/SvelteStore'

import { Clip } from './Clip'
import type { ClipArgs } from './Clip'

export interface ClipTrackConstructorArgs {
  id?: string
  clips?: { [key: string]: Clip }
  clipsOrder?: {
    [idx: string]: string
  }
  activeClip?: string | undefined
  instrument?: any
}

export class ClipTrack extends SvelteStore {
  id = crypto.randomUUID()
  clips: { [key: string]: Clip } = {}
  clipsOrder: {
    [idx: string]: string
  } = {}
  activeClip: string | undefined
  instrument

  constructor({
    id,
    clips,
    clipsOrder,
    activeClip,
    instrument,
  }: ClipTrackConstructorArgs = {}) {
    super()

    if (instrument) this.instrument = instrument
    if (id) {
      this.id = id
    }
    if (clips) {
      this.clips = Object.values(clips).reduce((m, val) => {
        m[val.id] = new Clip(val)
        m[val.id].instrument = instrument
        return m
      }, {})
    }
    if (clipsOrder) {
      this.clipsOrder = clipsOrder
    }
    if (activeClip) this.activeClip = activeClip
  }

  addClip(idx: string, args?: ClipArgs) {
    const clip = new Clip(args)
    clip.instrument = this.instrument
    this.clips[clip.id] = clip
    this.clipsOrder[idx] = clip.id

    this.updareSvelte(this)
    return clip
  }

  removeClip(idx: string) {
    delete this.clipsOrder[idx]

    this.updareSvelte(this)
  }

  setActiveClip(activeClip?: string) {
    this.activeClip = activeClip

    this.updareSvelte(this)
  }

  handler = (...args) => {
    const activeClip = this.clips[this.activeClip]
    if (activeClip) {
      activeClip.handler(...args)
    }
  }
}
