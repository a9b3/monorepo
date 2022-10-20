import type { SchedulerHandler } from '../scheduler/Scheduler'

export class Metronome {
  #ticksPerBeat: number

  osc: OscillatorNode
  output: GainNode

  constructor(args: { audioContext: AudioContext; ticksPerBeat: number }) {
    this.#ticksPerBeat = args.ticksPerBeat
    this.osc = args.audioContext.createOscillator()
    this.output = args.audioContext.createGain()

    this.osc.connect(this.output)
    this.output.gain.setValueAtTime(0, 0)
    this.osc.start(0)

    this.output.connect(args.audioContext.destination)
  }

  onTick: SchedulerHandler = ({ currentTick, nextTickTime }) => {
    if (currentTick % (this.#ticksPerBeat * 4) === 0) {
      this.osc.frequency.value = 440
      this.output.gain.setValueAtTime(0.1, nextTickTime)
      this.output.gain.setValueAtTime(0, nextTickTime + 0.06)
    } else if (currentTick % this.#ticksPerBeat === 0) {
      this.osc.frequency.value = 220
      this.output.gain.setValueAtTime(0.05, nextTickTime)
      this.output.gain.setValueAtTime(0, nextTickTime + 0.06)
    }
  }
}
