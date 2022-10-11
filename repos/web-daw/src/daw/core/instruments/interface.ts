import type { IONode } from 'daw/core/mixer'

export interface Instrument extends IONode {
  onMidi(e: WebMidi.MIDIMessageEvent): void
  connect(node: AudioNode): void
  disconnect(node?: AudioNode): void
}
