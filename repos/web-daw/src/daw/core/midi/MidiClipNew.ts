type MidiNote = {
  id: string
  startTick: number
  endTick: number
  note: number
  velocity: number
}

type CreateMidiNoteArgs = Omit<MidiNote, 'id'>

function createMidiNote(arg: CreateMidiNoteArgs) {
  return {
    ...arg,
    id: crypto.randomUUID(),
  }
}

export class MidiClip2 {
  eventsIndex: { [id: string]: MidiNote }
  /**
   * This is useful for quick UI rendering lookups.
   */
  notesIndex: { [note: string]: string[] }
  /**
   * This is useful for quick scheduling lookups.
   */
  startTickIndex: { [startTick: string]: string[] }

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
    opts.overlapType = opts.overlapType || 'deny'

    const mnote = createMidiNote(arg)

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
      if (
        mnote.startTick > pnote.startTick &&
        mnote.startTick < pnote.endTick
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
      if (mnote.endTick < pnote.endTick && mnote.endTick < pnote.startTick) {
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
      if (pnote.startTick < mnote.startTick && pnote.endTick > mnote.endTick) {
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
  }

  remove = (id: string) => {
    const pnote = this.eventsIndex[id]
    if (!pnote) {
      return
    }
    this.notesIndex[String[pnote.note]] = this.notesIndex[
      String[pnote.note]
    ].filter(_id => _id !== pnote.id)
    this.startTickIndex[String[pnote.startTick]] = this.startTickIndex[
      String[pnote.startTick]
    ].filter(_id => _id !== pnote.id)
  }

  getTickEvent(tick: number) {
    this.startTickIndex[]
  }
}
