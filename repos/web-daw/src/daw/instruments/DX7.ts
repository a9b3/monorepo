import { audioContext, PubSubUnit } from 'daw'
import type { ClipHandlerArg } from 'src/daw'
import { DX7Node } from './wams/DX7/DX7Node'
import { MidiEventTypeInteger } from 'daw/core/midi'

export interface DX7ConstructorArgs {}

export class DX7 extends PubSubUnit {
  dx7: DX7Node
  ready = false

  constructor() {
    super()
    this.#init()
  }

  async #init() {
    await DX7Node.importScripts(audioContext)
    this.dx7 = new DX7Node(audioContext)
    this.dx7.connect(audioContext.destination)
    this.ready = true

    this.dx7.onMidi([MidiEventTypeInteger.NoteOn, 50, 67])

    this.emit('update')
  }

  onMidi = () => {}
  handler = ({ nextTickTime, note }: ClipHandlerArg) => {
    // sample.play({ startTime: nextTickTime })
  }
}
