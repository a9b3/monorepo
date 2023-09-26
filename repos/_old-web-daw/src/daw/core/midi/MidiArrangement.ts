export enum MidiEventTypeInteger {
  NoteOff = 128,
  NoteOn = 144,
  NoteAftertouch = 10,
  Controller = 11,
  ProgramChange = 12,
  ChannelAftertouch = 13,
  PitchBend = 14,
}

export interface MidiEventT {
  type:
    | 'NoteOff'
    | 'NoteOn'
    | 'NoteAftertouch'
    | 'Controller'
    | 'ProgramChange'
    | 'ChannelAftertouch'
    | 'PitchBend'
  value: 0x80 | 0x90 | 0xa | 0xb | 0xc | 0xd | 0xe
  // NoteOn: 0 - 127
  // NoteOff: 0 - 127
  param1: number
  // NoteOn: velocity 0 - 127
  param2?: number | undefined
}

interface MidiTrackChunk {
  name: string
  events: MidiEvent[]
}

/**
 * Partial implementation of the midi specifications.
 *
 * Resources:
 * https://www.midi.org/specifications/midi-2-0-specifications
 * http://www.music.mcgill.ca/~ich/classes/mumt306/StandardMIDIfileformat.html
 * https://github.com/colxi/midi-parser-js/wiki/MIDI-File-Format-Specifications
 */
export interface MidiArrangement {
  /**
   * 0 - Only has one track contains all events.
   * 1 - 2 or more tracks, 1st track contains metadata, 2nd and following tracks
   * contain events related to the specific track.
   * 2 - Multiple tracks with different sequences.
   */
  formatType: 0
  /**
   * Only 1 track since we are hardcoded to the 0 format type.
   */
  numTracks: 1
  /**
   * Ticks per beat or frames per second.
   */
  timeDivision: 960
  trackChunks: MidiTrackChunk[]
}
