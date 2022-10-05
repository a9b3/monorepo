import { EventEmitter } from 'events'
import type { SchedulerHandlerArg } from './Scheduler'

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

export type ClipHandlerArg = SchedulerHandlerArg & { note: Note }

export class Clip extends EventEmitter {
  id = crypto.randomUUID()
  name: string

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

  constructor({ id, label, notes, name }: any = {}) {
    super()

    if (name) this.name = name
    if (label) this.label = label
    if (id) this.id = id
    if (notes) this.notes = notes
  }

  setBar(bar: number) {
    this.bar = bar

    this.emit('update')
  }

  setBeat(beat: number) {
    this.beat = beat

    this.emit('update')
  }

  setLabel(label: string) {
    this.label = label

    this.emit('update')
  }

  setName(name: string) {
    this.name = name

    this.emit('update')
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

    this.emit('update')
  }

  removeNote({ startTick, frequency }) {
    delete this.notes[startTick][frequency]

    this.emit('update')
  }

  setInstrument(instrument) {
    this.instrument = instrument

    this.emit('update')
  }

  handler = ({ currentTick, nextTickTime, ticksPerBeat }) => {
    const loopLength = this.bar * 4 * ticksPerBeat
    const offsetTick = currentTick % loopLength

    const notes = this.notes[offsetTick]
    if (notes) {
      Object.values(notes).forEach(note => {
        if (this.instrument) {
          this.instrument.handler({
            currentTick,
            nextTickTime,
            ticksPerBeat,
            note,
          })
        }
      })
    }
  }

  subscribe = (listener: (state: this) => void) => {
    listener(this)
    const invokeListener = () => {
      listener(this)
    }
    this.on('update', invokeListener)

    return () => {
      this.removeListener('update', invokeListener)
    }
  }
}
