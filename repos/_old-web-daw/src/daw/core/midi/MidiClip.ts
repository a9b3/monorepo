import { Subscribable } from '../ui/Subscribable'
import type { MidiArrangement } from './MidiArrangement'
import { TicksPerBeat } from '../constants'

// TODO need to capture all possible midi event types. Currently just dealing
// with noteOn and noteOff
// http://www.music.mcgill.ca/~ich/classes/mumt306/StandardMIDIfileformat.html#BM3_
export interface MidiEvent {
  /**
   * Used internally to allow O(1) read/writes
   */
  id?: string
  type: 'noteOn' | 'noteOff'
  note: number
  velocity?: number
  startTick?: number
  endTick?: number
}

type MidiNote = {
  id?: string
  type: 'noteOn'
  startTick: number
  endTick?: number
  note: number
  velocity?: number
}

type CreateMidiNoteArgs = Omit<MidiNote, 'id'> & { id?: string }

function createMidiNote(arg: CreateMidiNoteArgs) {
  return {
    ...arg,
    type: 'noteOn',
    id: arg.id || crypto.randomUUID(),
  }
}

export type EventsMap = {
  [tick: string]: { [note: string]: { [id: string]: MidiEvent } }
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

  // -----------------
  // New Internal Data Structure
  // -----------------
  eventsIndex: { [id: string]: MidiNote }
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
    midiArrangement?: MidiArrangement
    eventsMap?: EventsMap
    offsetStartTick?: number
    beatsPerLoop?: number
    eventsIndex?: { [id: string]: MidiNote }
    notesIndex?: { [note: string]: string[] }
    startTickIndex?: { [startTick: string]: string[] }
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
    this.beatsPerLoop = args.beatsPerLoop || 8

    this.eventsIndex = args.eventsIndex || {}
    this.notesIndex = args.notesIndex || {}
    this.startTickIndex = args.startTickIndex || {}
  }

  get totalLoopTicks() {
    return this.beatsPerLoop * TicksPerBeat
  }

  get offsetEndTick() {
    return this.offsetStartTick + this.totalLoopTicks
  }

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
    const res = (this.startTickIndex[tick] || [])
      .filter(id => this.eventsIndex[id].note === note)
      .map(id => this.eventsIndex[id])
    return res.length === 0 ? undefined : res
  }

  /**
   * Overlap behavior
   */
  insert = (
    arg: CreateMidiNoteArgs,
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
    const mnote = createMidiNote(arg)

    const toRemove = new Set<string>()
    const prevNoteIds = this.notesIndex[String(mnote.note)] || []
    // TODO I wonder if there's a more elegant way to do this using some set
    // logic.
    for (let i = 0; i < prevNoteIds.length; i += 1) {
      const prevId = prevNoteIds[i]
      const pnote = this.eventsIndex[prevId]

      console.log('oninsert')

      // no overlap
      if (pnote.startTick > mnote.endTick || mnote.startTick > pnote.endTick) {
        console.log(`no overlap`)
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
        console.log(`new note starts in middle`)
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
        console.log(`new note starts in middle 2`)
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
        console.log(`middle 3`)
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

  // getTickEvent(tick: number) {
  //   // this.startTickIndex[]
  // }

  /**
   * returnTotal = false will return only events within the loop range and after
   * the offsetStartTick
   */
  getStartIndexForUI(opt?: { onlyLoopEvents?: boolean }) {
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

  getTickEvents(tick: number) {
    return (this.startTickIndex[String(tick)] || []).map(
      id => this.eventsIndex[id]
    )
  }
}
