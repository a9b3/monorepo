import { Subscribable } from '../Subscribable'

/**
 * Use this interface to encapsulate a chain of AudioNodes to ensure there is an
 * input and output.
 */
export class IONode extends Subscribable {
  input: GainNode
  output: GainNode

  constructor(audioContext: AudioContext) {
    super()

    this.input = audioContext.createGain()
    this.output = audioContext.createGain()
  }

  connect(unit: IONode | AudioNode) {
    this.output.connect(unit instanceof AudioNode ? unit : unit.input)
  }

  disconnect(unit?: IONode | AudioNode) {
    if (!unit) {
      this.output.disconnect()
      return
    }
    if (unit instanceof AudioNode) {
      this.output.disconnect(unit)
    } else {
      this.output.disconnect(unit.input)
    }
  }
}
