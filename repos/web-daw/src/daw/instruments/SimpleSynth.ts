import { audioContext, PubSubUnit } from 'src/daw'
import type { ClipHandlerArg } from 'src/daw'
import type { InstrumentInterface } from './InstrumentInterface'

export interface SimpleSynthConstructorArgs {}

export class SimpleSynth extends PubSubUnit implements InstrumentInterface {
  #osc = audioContext.createOscillator()

  constructor() {
    super()
    this.#osc.connect(this.input)
  }

  handler = ({ nextTickTime, note }: ClipHandlerArg) => {
    // sample.play({ startTime: nextTickTime })
  }
}
