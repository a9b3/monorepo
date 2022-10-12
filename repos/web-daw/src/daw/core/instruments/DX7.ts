import { MidiEventTypeInteger } from 'daw/core/midi'
import { IONode } from 'daw/core/mixer'
import { DX7Node } from './wams/DX7Node'

export class DX7 extends IONode {
  dx7: DX7Node
  ready = false

  constructor({ audioContext }: { audioContext: AudioContext }) {
    super(audioContext)
    this.#init(audioContext)
  }

  async #init(audioContext: AudioContext) {
    await DX7Node.importScripts(audioContext)
    this.dx7 = new DX7Node(audioContext)
    this.dx7.connect(this.output)
    this.ready = true

    this.emit('update')
  }

  onMidi = e => {
    this.dx7.onMidi([MidiEventTypeInteger.NoteOn, e.note, 67])
    setTimeout(() => {
      this.dx7.onMidi([MidiEventTypeInteger.NoteOff, e.note, 67])
    }, 1000)

    this.emit('update')
  }
}
