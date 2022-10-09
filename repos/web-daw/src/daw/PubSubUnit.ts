import { audioContext, PubSub } from 'src/daw'
import type { UnitInterface } from 'src/daw'

export class PubSubUnit extends PubSub implements UnitInterface {
  input: GainNode = audioContext.createGain()
  output: GainNode = audioContext.createGain()

  constructor() {
    super()
    this.input.connect(this.output)
  }

  connect(unit: UnitInterface | AudioNode): void {
    this.output.connect(unit instanceof AudioNode ? unit : unit.input)
  }

  disconnect(unit?: UnitInterface | AudioNode): void {
    if (unit) {
      this.output.disconnect(unit instanceof AudioNode ? unit : unit.input)
    } else {
      this.output.disconnect()
    }
  }
}
