import { Subscribable } from '../Subscribable'
import { TicksPerBeat } from '../constants'

export enum MidiEventTypes {
  noteOff = 128,
  noteOn = 144,
  noteAftertouch = 10,
  controller = 11,
  programChange = 12,
  channelAftertouch = 13,
  pitchBend = 14,
}

// TODO need to capture all possible midi event types. Currently just dealing
// with noteOn and noteOff
// http://www.music.mcgill.ca/~ich/classes/mumt306/StandardMIDIfileformat.html#BM3_
export interface MidiEvent {
  /**
   * Used internally to allow O(1) read/writes
   */
  endTick?: number
  id?: string
  note: number
  startTick?: number
  type: MidiEventTypes
  velocity?: number
}

type CreateMidiEventArgs = Omit<MidiEvent, 'id'> & { id?: string }

function createMidiEvent(arg: CreateMidiEventArgs) {
  return {
    ...arg,
    type: MidiEventTypes.noteOn,
    id: arg.id || crypto.randomUUID(),
  }
}

/**
 * eventsIndex    {[id: string]: { id: string, startTick: number, endTick: number, note: number, velocity: number }}
 * notesIndex     {[note: string]: Set}
 * startTickIndex {[startTick: string]: Set}
 *
 * Insertion({ startTick, note })
 * 1. notesIndex[note].forEach(id => eventsIndex[id].contains(startTick])
 *
 * Abstraction on top of MidiArrangement that includes conviences for the UI.
 */
export class MidiClip extends Subscribable {
  MidiEventTypes = MidiEventTypes
  /**
   * Useful for keeping track of selections in UI.
   */
  id: string
  /**
   * A display name for this clip.
   */
  name: string | undefined
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
  beatsPerBeat: number

  // --------------------------------------------------------------------------
  // Midi Events data structures
  // --------------------------------------------------------------------------

  eventsIndex: { [id: string]: MidiEvent }
  /**
   * This is useful for quick UI rendering lookups.
   */
  notesIndex: { [note: string]: string[] }
  /**
   * This is useful for quick scheduling lookups.
   */
  startTickIndex: { [startTick: string]: string[] }

  constructor(args: {
    id: string
    name?: string
    offsetStartTick?: number
    beatsPerLoop?: number
    eventsIndex?: { [id: string]: MidiEvent }
    notesIndex?: { [note: string]: string[] }
    startTickIndex?: { [startTick: string]: string[] }
  }) {
    super()

    this.id = args.id
    this.name = args.name
    this.offsetStartTick = args.offsetStartTick || 0
    this.beatsPerLoop = args.beatsPerLoop || 8

    this.eventsIndex = args.eventsIndex || {}
    this.notesIndex = args.notesIndex || {}
    this.startTickIndex = args.startTickIndex || {}
  }

  // -------------------------------------------------------------------------
  // Getters
  // -------------------------------------------------------------------------

  /**
   * amount of ticks in this clip
   */
  get totalLoopTicks() {
    return this.beatsPerLoop * TicksPerBeat
  }

  /**
   * the absolute end tick value
   */
  get offsetEndTick() {
    return this.offsetStartTick + this.totalLoopTicks
  }

  /**
   * max and min notes in this clip
   */
  get noteRange() {
    let max = Number.NEGATIVE_INFINITY
    let min = Number.POSITIVE_INFINITY
    const notes = Object.keys(this.notesIndex)
    for (let i = 0; i < notes.length; i += 1) {
      const n = Number(notes[i])
      max = Math.max(n, max)
      min = Math.min(n, min)
    }
    return { max, min }
  }

  // -------------------------------------------------------------------------
  // Setters
  // -------------------------------------------------------------------------

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

  // -------------------------------------------------------------------------
  // MIDI Events
  // -------------------------------------------------------------------------

  /**
   * Get MidiEvent at tick and note
   */
  getEvents(tick: number, note: number): MidiEvent[] {
    const res = (this.startTickIndex[tick] || [])
      .filter(id => this.eventsIndex[id].note === note)
      .map(id => this.eventsIndex[id])
    return res.length === 0 ? undefined : res
  }

  /**
   * Overlap behavior
   */
  insert = (
    arg: CreateMidiEventArgs,
    opts: {
      /**
       * replace:
       *    Remove prexisting note(s) and replace with new one
       * splice:
       *    Adjust prexisting note(s) endTick/startTick
       * deny:
       *    Do not allow overwriting preexisting note(s) new note is not
       *    inserted.
       */
      overlapType?: 'replace' | 'splice' | 'deny'
    } = {}
  ) => {
    // Default options
    opts.overlapType = opts.overlapType || 'replace'

    if (arg.id) {
      this.remove(arg.id)
    }

    const mnote = createMidiEvent(arg)
    const toRemove = new Set<string>()
    const prevNoteIds = this.notesIndex[String(mnote.note)] || []

    // TODO I wonder if there's a more elegant way to do this using some set
    // logic.
    for (let i = 0; i < prevNoteIds.length; i += 1) {
      const prevId = prevNoteIds[i]
      const pnote = this.eventsIndex[prevId]

      // no overlap
      if (pnote.startTick > mnote.endTick || mnote.startTick > pnote.endTick) {
        break
      }

      // new note starts in the middle of preexsting note
      //
      // mnote[------]
      //  [-----]pnote
      //  [ppp[mmmmmm]
      if (
        mnote.startTick >= pnote.startTick &&
        mnote.startTick <= pnote.endTick
      ) {
        if (opts.overlapType === 'replace') {
          toRemove.add(pnote.id)
        } else if (opts.overlapType === 'splice') {
          pnote.endTick = mnote.startTick - 1
        } else {
          // can early exit since this is the deny case and an overlap was found
          return
        }
      }

      // new note ends in the middle of the preexisting note
      // mnote [-----------]
      // pnote         [             ]
      if (mnote.endTick <= pnote.endTick && mnote.endTick >= pnote.startTick) {
        if (opts.overlapType === 'replace') {
          toRemove.add(pnote.id)
        } else if (opts.overlapType === 'splice') {
          pnote.startTick = mnote.endTick + 1
        } else {
          // can early exit since this is the deny case and an overlap was found
          return
        }
      }

      // new note encompasses the preexisting note
      if (
        pnote.startTick <= mnote.startTick &&
        pnote.endTick >= mnote.endTick
      ) {
        if (opts.overlapType === 'replace') {
          toRemove.add(pnote.id)
        } else if (opts.overlapType === 'splice') {
          mnote.endTick = mnote.startTick - 1
        } else {
          // can early exit since this is the deny case and an overlap was found
          return
        }
      }
    }

    // above loop should be responsible for early return if opt is set to deny
    // so this should be safe to run
    toRemove.forEach(id => {
      this.remove(id)
    })

    // Sets the MidiEvent in all the internal data structures
    this.eventsIndex[mnote.id] = mnote
    this.notesIndex[String(mnote.note)] =
      this.notesIndex[String(mnote.note)] || []
    if (!this.notesIndex[String(mnote.note)].includes(mnote.id)) {
      this.notesIndex[String(mnote.note)].push(mnote.id)
    }
    this.startTickIndex[String(mnote.startTick)] =
      this.startTickIndex[String(mnote.startTick)] || []
    if (!this.startTickIndex[String(mnote.startTick)].includes(mnote.id)) {
      this.startTickIndex[String(mnote.startTick)].push(mnote.id)
    }

    this.emit('update')
  }

  /**
   * Remove a MidiEvent by id from all internal data structures.
   */
  remove = (id: string) => {
    const pnote = this.eventsIndex[id]
    if (!pnote) {
      return
    }
    this.notesIndex[String(pnote.note)] = this.notesIndex[
      String(pnote.note)
    ].filter(_id => _id !== pnote.id)
    this.startTickIndex[String(pnote.startTick)] = this.startTickIndex[
      String(pnote.startTick)
    ].filter(_id => _id !== pnote.id)

    this.emit('update')
  }

  /**
   * returnTotal = false will return only events within the loop range and after
   * the offsetStartTick
   */
  getStartIndexForUI(opt?: { onlyLoopEvents?: boolean }): {
    [tick: string]: MidiEvent[]
  } {
    opt = opt || {}
    opt.onlyLoopEvents = opt.onlyLoopEvents || false

    let entries = Object.entries(this.startTickIndex)
    if (opt.onlyLoopEvents) {
      entries = entries.filter(
        ([tick]) =>
          Number(tick) >= this.offsetStartTick &&
          Number(tick) <= this.offsetEndTick
      )
    }

    const produced = Object.fromEntries(
      entries.map(([key, ids]) => {
        return [String(key), ids.map(id => this.eventsIndex[id])]
      })
    )
    return produced
  }

  /**
   * Get MidiEvent(s) at given tick.
   */
  getTickEvents(tick: number): MidiEvent[] {
    return (this.startTickIndex[String(tick)] || []).map(
      id => this.eventsIndex[id]
    )
  }
}
