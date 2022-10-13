import { MidiEventTypeInteger } from '../midi'
import { IONode } from '../mixer'
import { DX7Node } from './wams/DX7Node'
import type { Instrument } from './interface'

export class DX7 extends IONode implements Instrument {
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

  onMidi: Instrument['onMidi'] = e => {
    const type =
      e.type === 'noteOn'
        ? MidiEventTypeInteger.NoteOn
        : MidiEventTypeInteger.NoteOff
    this.dx7.onMidi([type, e.note, e.velocity, e.nextTickTime])

    this.emit('update')
  }

  stop() {
    // hack to run noteOff in the future to account for already scheduled events.
    setTimeout(() => {
      for (let i = 0; i < 127; i += 1) {
        this.dx7.onMidi([MidiEventTypeInteger.NoteOff, i, 0])
      }
    }, 80)
  }
}
