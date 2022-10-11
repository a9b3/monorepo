import { EventEmitter } from 'events'
import type { MidiArrangement } from './MidiArrangement'

type EventsMap = {
  [tick: number]: WebMidi.MIDIMessageEvent
}

/**
 * Abstraction on top of MidiArrangement that includes conviences for the UI.
 */
export class MidiClip extends EventEmitter {
  /**
   * Useful for keeping track of selections in UI.
   */
  id: string
  /**
   * A display name for this clip.
   */
  name: string
  /**
   * The actual midi arrangement.
   */
  midiArrangement: MidiArrangement
  /**
   * More efficient storage format for midi events. Keyed by the tick for O(1)
   * lookup and inserts.
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
    name: string
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
    this.beatsPerLoop = args.beatsPerLoop || 16
  }
}
