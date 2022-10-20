import type { IONode } from '../mixer/IONode'
import type { MidiEvent } from '../midi/MidiClip'

export interface Instrument extends IONode {
  onMidi(e: MidiEvent & { nextTickTime?: number }): void
  connect(node: AudioNode): void
  disconnect(node?: AudioNode): void
}

export enum InstrumentType {
  Sampler = 'Sampler',
  DX7 = 'DX7',
}
