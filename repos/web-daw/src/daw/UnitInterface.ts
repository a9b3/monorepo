export interface UnitInterface {
  /**
   *
   */
  input: AudioNode | undefined
  output: AudioNode | undefined
  connect(unit: UnitInterface | AudioNode): void
  disconnect(unit?: UnitInterface | AudioNode): void
}
