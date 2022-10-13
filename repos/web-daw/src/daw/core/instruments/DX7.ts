import { MidiEventTypeInteger } from 'daw/core/midi'
import { IONode } from 'daw/core/mixer'
import { DX7Node } from './wams/DX7Node'

export class DX7 extends IONode {
  #nextTickTime = 0
  dx7: DX7Node
  ready = false
  audioContext: AudioContext

  constructor({ audioContext }: { audioContext: AudioContext }) {
    super(audioContext)
    this.#init(audioContext)
    this.audioContext = audioContext
  }

  async #init(audioContext: AudioContext) {
    await DX7Node.importScripts(audioContext)
    this.dx7 = new DX7Node(audioContext)
    this.dx7.connect(this.output)
    this.ready = true

    this.emit('update')
  }

  onMidi = e => {
    console.log(`onmidi`, e)
    const type =
      e.type === 'noteOn'
        ? MidiEventTypeInteger.NoteOn
        : MidiEventTypeInteger.NoteOff
    this.dx7.onMidi([type, e.note, e.velocity, e.nextTickTime])
    this.#nextTickTime = e.nextTickTime

    this.emit('update')
  }

  stop() {
    setTimeout(() => {
      for (let i = 0; i < 127; i++) {
        this.dx7.onMidi([MidiEventTypeInteger.NoteOff, i, 0])
      }
    }, 80)
  }
}
