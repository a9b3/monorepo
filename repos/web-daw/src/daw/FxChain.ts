import { audioContext } from './audioContext'
import type { UnitInterface } from './UnitInterface'

export class FxChain implements UnitInterface {
  input: GainNode = audioContext.createGain()
  fx: UnitInterface[]
  output: GainNode = audioContext.createGain()

  constructor() {
    this.input.connect(this.output)
  }

  connect(unit: UnitInterface | AudioNode) {
    if (unit instanceof AudioNode) {
      this.output.connect(unit)
    } else {
      this.output.connect(unit.input)
    }
  }

  disconnect(unit?: UnitInterface | AudioNode) {
    if (!unit) {
      this.output.disconnect()
    }
    if (unit instanceof AudioNode) {
      this.output.disconnect(unit)
    } else {
      this.output.disconnect(unit.input)
    }
  }

  _getBeforeAfterNodes(idx: number) {
    const beforeUnit = idx - 1 < 0 ? this.input : this.fx[idx - 1]
    const afterUnit =
      idx + 1 > this.fx.length - 1 ? this.output : this.fx[idx + 1]
    return {
      beforeUnit,
      afterUnit,
    }
  }

  /**
   * Adds fx unit into the fx chain.
   */
  insertFx(unit: UnitInterface, idx: number = this.fx.length) {
    this.fx.splice(idx, 0, unit)

    const { beforeUnit, afterUnit } = this._getBeforeAfterNodes(idx)

    beforeUnit.disconnect(afterUnit)
    beforeUnit.connect(unit.input)
    unit.connect(afterUnit)
  }

  /**
   * Remove fx unit from the fx chain.
   */
  removeFx(unit: UnitInterface) {
    const idx = this.fx.indexOf(unit)
    if (idx < 0) {
      throw new Error(
        `Trying to remove ${unit} that does not exist in the fx chain.`
      )
    }

    const { beforeUnit, afterUnit } = this._getBeforeAfterNodes(idx)
    const removedUnit = this.fx[idx]
    removedUnit.disconnect(afterUnit)
    beforeUnit.disconnect(removedUnit)
    beforeUnit.connect(
      afterUnit instanceof AudioNode ? afterUnit : afterUnit.input
    )
    this.fx.splice(idx, 1)
  }

  // TODO
  moveFx(from: number, to: number) {}

  // TODO
  bypassFx() {}
}
