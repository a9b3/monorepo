import type { IONode } from 'daw/core/mixer'
import type { MidiEvent } from 'daw/core/midi'

export interface Instrument extends IONode {
  onMidi(e: MidiEvent & { nextTickTime: number }): void
  connect(node: AudioNode): void
  disconnect(node?: AudioNode): void
}

export enum InstrumentType {
  Sampler = 'Sampler',
  DX7 = 'DX7',
}
