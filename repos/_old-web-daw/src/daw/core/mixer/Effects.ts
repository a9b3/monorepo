import { IONode } from './IONode'

export class Effects extends IONode {
  effects: IONode[]

  constructor(args: { audioContext: AudioContext }) {
    super(args.audioContext)

    this.input.connect(this.output)
  }

  #getBeforeAfterNodes(idx: number): {
    beforeUnit: IONode | AudioNode
    afterUnit: IONode | AudioNode
  } {
    const beforeUnit = idx - 1 < 0 ? this.input : this.effects[idx - 1]
    const afterUnit =
      idx + 1 > this.effects.length - 1 ? this.output : this.effects[idx + 1]
    return {
      beforeUnit,
      afterUnit,
    }
  }

  /**
   * Adds effects unit into the effects chain.
   */
  insertEffect(unit: IONode, idx: number = this.effects.length) {
    this.effects.splice(idx, 0, unit)

    const { beforeUnit, afterUnit } = this.#getBeforeAfterNodes(idx)

    beforeUnit.disconnect(afterUnit)
    beforeUnit.connect(unit.input)
    unit.connect(afterUnit)

    this.emit('update')
  }

  /**
   * Remove effects unit from the effects chain.
   */
  removeEffect(idx: number) {
    const { beforeUnit, afterUnit } = this.#getBeforeAfterNodes(idx)
    const removedUnit = this.effects[idx]
    removedUnit.disconnect(afterUnit)
    beforeUnit.disconnect(removedUnit)
    beforeUnit.connect(
      afterUnit instanceof AudioNode ? afterUnit : afterUnit.input
    )
    this.effects.splice(idx, 1)

    this.emit('update')
    return removedUnit
  }

  moveEffect(from: number, to: number) {
    if (from < to) {
      to += 1
    }

    const unit = this.removeEffect(from)
    this.insertEffect(unit, to)
  }
}
