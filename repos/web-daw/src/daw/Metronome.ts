import { audioContext } from './audioContext'

export class Metronome {
  osc = audioContext.createOscillator()
  output = audioContext.createGain()

  constructor() {
    this.osc.connect(this.output)
    this.output.gain.setValueAtTime(0, 0)
    this.osc.start(0)
    this.output.connect(audioContext.destination)
  }

  handler = ({ currentTick, nextTickTime, ticksPerBeat }) => {
    if (currentTick % (ticksPerBeat * 4) === 0) {
      this.osc.frequency.value = 440
      this.output.gain.setValueAtTime(0.2, nextTickTime)
      this.output.gain.setValueAtTime(0, nextTickTime + 0.06)
    } else if (currentTick % ticksPerBeat === 0) {
      this.osc.frequency.value = 220
      this.output.gain.setValueAtTime(0.1, nextTickTime)
      this.output.gain.setValueAtTime(0, nextTickTime + 0.06)
    }
  }
}
