export type Note = {
  type: 'on' | 'off'
  note: string
  frequency?: number
}

export interface ClipArgs {
  id?: string
  label?: string
  bar?: number
  beat?: number
}

export class Clip {
  id = crypto.randomUUID()

  /**
   * Notes will be keyed by ticks. The scheduler will attempt to access this map
   * as it tries to find activity to schedule.
   */
  notes: { [tick: string]: Note[] } = {}

  label = 'Untitled'
  bar = 2
  beat = 4

  instrument

  constructor({ id, label } = {}) {
    if (label) {
      this.label = label
    }
    if (id) {
      this.id = id
    }
  }

  setBar(bar: number) {
    this.bar = bar
  }

  setBeat(beat: number) {
    this.beat = beat
  }

  setLabel(label: string) {
    this.label = label
  }

  addNote(note: number, value) {
    this.notes[note] = value
  }

  removeNote(note: number, idx?: number) {
    if (idx) {
      delete this.notes[note][idx]
    } else {
      delete this.notes[note]
    }
  }

  setInstrument(instrument) {
    this.instrument = instrument
  }

  handler = ({ currentTick, nextTickTime, ticksPerBeat }) => {
    const loopLength = this.bar * 4 * ticksPerBeat
    const offsetTick = currentTick % loopLength

    const notes = this.notes[offsetTick]
    for (let i = 0; i < notes.length; i++) {
      this.instrument.processNote(notes[i], {
        currentTick,
        nextTickTime,
        ticksPerBeat,
      })
    }
  }
}
