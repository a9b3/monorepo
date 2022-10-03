import { Mixer } from './Mixer'

export class Project {
  mixer: Mixer = new Mixer()
  name: string = 'Untitled'
  bpm: number = 120
  timeSignature: { top: number; bottom: number } = {
    top: 4,
    bottom: 4,
  }

  clipSets = []
  playlists = []

  constructor() {}

  addClipTrack() {
    this.clipTracks.push(new MidiClipTrack())
  }

  removeClipTrack(idx) {
    this.clipTracks.splice(idx, 1)
  }
}
