import { Clip } from './Clip'
import type { ClipArgs } from './Clip'
import { SvelteStore } from 'src/utils/SvelteStore'

export interface ClipTrackArgs {
  clips?: { [key: string]: ClipArgs }
}

export class ClipTrack extends SvelteStore<ClipTrack> {
  id = crypto.randomUUID()
  clips: { [key: string]: ClipArgs } = {}

  constructor(arg?: ClipTrackArgs) {
    super()
    if (arg) {
      this.fromJSON(arg)
    }
  }

  addClip(idx: string, args?: ClipArgs) {
    this.clips[idx] = new Clip(args)
  }

  removeClip(idx: string, args?: ClipArgs) {
    this.clips[idx] = new Clip(args)
  }

  toJSON() {}
  fromJSON(arg?: ClipTrackArgs) {}

  subscribe(listener) {
    return () => {}
  }
}
