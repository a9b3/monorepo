import { SvelteStore } from 'src/utils/SvelteStore'

import { Clip } from './Clip'
import type { ClipArgs } from './Clip'

export class ClipTrack extends SvelteStore {
  id = crypto.randomUUID()
  clips: { [key: string]: Clip } = {}
  clipsOrder: {
    [idx: string]: string
  } = {}

  constructor({ id, clips, clipsOrder } = {}) {
    super()

    if (id) {
      this.id = id
    }
    if (clips) {
      this.clips = Object.values(clips).reduce((m, val) => {
        m[val.id] = val
        return m
      }, {})
    }
    if (clipsOrder) {
      this.clipsOrder = clipsOrder
    }
  }

  addClip(idx: string, args?: ClipArgs) {
    const clip = new Clip(args)
    this.clips[clip.id] = clip
    this.clipsOrder[idx] = clip.id

    this.updareSvelte(this)
  }

  removeClip(idx: string) {
    delete this.clipsOrder[idx]

    this.updareSvelte(this)
  }
}
