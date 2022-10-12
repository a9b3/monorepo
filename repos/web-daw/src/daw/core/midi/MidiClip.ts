import { Subscribable } from '../ui'
import type { MidiArrangement } from './MidiArrangement'

// TODO need to capture all possible midi event types. Currently just dealing
// with noteOn and noteOff
// http://www.music.mcgill.ca/~ich/classes/mumt306/StandardMIDIfileformat.html#BM3_
export interface MidiEvent {
  /**
   * Used internally to allow O(1) read/writes
   */
  id: string
  type: 'noteOn' | 'noteOff'
  note: number
  velocity: number
}

type EventsMap = {
  [tick: string]: { [note: string]: { [id: string]: MidiEvent } }
}

/**
 * Abstraction on top of MidiArrangement that includes conviences for the UI.
 */
export class MidiClip extends Subscribable {
  /**
   * Useful for keeping track of selections in UI.
   */
  id: string
  /**
   * A display name for this clip.
   */
  name: string | undefined
  /**
   * The actual midi arrangement.
   */
  midiArrangement: MidiArrangement
  /**
   * More efficient storage format for midi events. Keyed by the tick for O(1)
   * lookup and inserts. Useful for playback. Rendering into UI is fine with
   * O(n).
   */
  eventsMap: EventsMap
  /**
   * For loops and recording, the desired starting tick might not be exactly 0.
   * Allow setting an offset to create arbitrary loop lengths for arrangements.
   *
   * ex.
   *
   *    Total captured = []
   *    Desired = {}
   *
   *    [----{-----}-]
   *
   * For scheduling playback add offsetStartTick to currentTick from scheduler.
   */
  offsetStartTick: number
  /**
   * loopLength should be number in beats.
   * ( currentTick % ( loopLength * ticksPerbeat ) ) + offsetStartTick
   */
  beatsPerLoop: number

  constructor(args: {
    id: string
    name?: string
    midiArrangement?: MidiArrangement
    eventsMap?: EventsMap
    offsetStartTick?: number
    beatsPerLoop?: number
  }) {
    super()

    this.id = args.id
    this.name = args.name
    this.midiArrangement = args.midiArrangement || {
      formatType: 0,
      numTracks: 1,
      timeDivision: 960,
      trackChunks: [],
    }
    this.eventsMap = args.eventsMap || {}
    this.offsetStartTick = args.offsetStartTick || 0
    this.beatsPerLoop = args.beatsPerLoop || 4
  }

  /**
   * Add a MidiEvent into the eventsMap.
   */
  addEvent(tick: number, midiEvent: Omit<MidiEvent, 'id'>) {
    const tickStr = String(tick)

    this.eventsMap[tickStr] = this.eventsMap[tickStr] || {}
    this.eventsMap[tickStr][midiEvent.note] =
      this.eventsMap[tickStr][midiEvent.note] || {}
    const id = crypto.randomUUID()
    this.eventsMap[tickStr][midiEvent.note][id] = { ...midiEvent, id }

    this.emit('update')
  }

  removeEvent(tick: number, note: string, id: string) {
    if (this.eventsMap[String(tick)]?.[note]?.[id]) {
      delete this.eventsMap[String(tick)]?.[note]?.[id]
    }

    this.emit('update')
  }

  setBeatsPerLoop(beatsPerLoop: number) {
    this.beatsPerLoop = beatsPerLoop

    this.emit('update')
  }

  setOffsetStartTick(offsetStartTick: number) {
    this.offsetStartTick = offsetStartTick

    this.emit('update')
  }

  setName(name: string) {
    this.name = name

    this.emit('update')
  }

  getEvents(tick: number, note: number) {
    return Object.values(this.eventsMap[String(tick)]?.[note])
  }
}
