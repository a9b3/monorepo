enum TrackType {
  MIDI = 'midi',
}

export class EditorState {
  selected
}

export class Settings {
  // Standard amounts of ticks per beat
  // https://music.arts.uci.edu/dobrian/maxcookbook/beat-divisions-transport
  ticksPerBeat = 480
}

export class MidiClip {}

export class MidiClipTrack {
  id
  type = TrackType.MIDI
  label = ''
  clips = []

  constructor() {
    this.id = crypto.randomUUID()
  }
}

export class Project {
  bpm = 120
  clipTracks = []
  timeSignature = {
    top: 4,
    bottom: 4,
  }

  addClipTrack() {
    this.clipTracks.push(new MidiClipTrack())
  }

  removeClipTrack(idx) {
    this.clipTracks.splice(idx, 1)
  }
}
