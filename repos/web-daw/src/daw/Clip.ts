import { SvelteStore } from 'src/utils/SvelteStore'

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

export class Clip extends SvelteStore {
  id = crypto.randomUUID()

  /**
   * Notes will be keyed by ticks. The scheduler will attempt to access this map
   * as it tries to find activity to schedule.
   */
  notes: { [tick: string]: { [frequency: string]: Note } } = {}

  ticksPerBeat = 480
  label = 'Untitled'
  bar = 2
  beat = 4

  instrument

  constructor({ id, label, notes }: any = {}) {
    super()
    if (label) {
      this.label = label
    }
    if (id) {
      this.id = id
    }
    if (notes) {
      this.notes = notes
    }
  }

  setBar(bar: number) {
    this.bar = bar

    this.updareSvelte(this)
  }

  setBeat(beat: number) {
    this.beat = beat

    this.updareSvelte(this)
  }

  setLabel(label: string) {
    this.label = label

    this.updareSvelte(this)
  }

  addNote({ startTick, type, note, frequency }) {
    if (!this.notes[startTick]) {
      this.notes[startTick] = {}
    }
    this.notes[startTick][frequency] = {
      type,
      note,
      frequency,
    }

    this.updareSvelte(this)
  }

  removeNote({ startTick, type, note, frequency }) {
    delete this.notes[startTick][frequency]

    this.updareSvelte(this)
  }

  setInstrument(instrument) {
    this.instrument = instrument

    this.updareSvelte(this)
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
