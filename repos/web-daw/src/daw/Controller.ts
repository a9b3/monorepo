import { Metronome } from './Metronome'
import { Scheduler } from './Scheduler'

type ControllerHandler = (arg: {
  currentTick: number
  nextTickTime: number
  ticksPerBeat: number
}) => void

export class Controller {
  handlers: ControllerHandler[] = []
  metronome = new Metronome()
  scheduler = new Scheduler()
  id = crypto.randomUUID()
  bpm = 120
  timeSignature: { top: number; bottom: number } = {
    top: 4,
    bottom: 4,
  }
  isPlaying = false
  isMetronomeActive = true

  constructor(args?: any) {
    if (args) {
      this.fromJSON(args)
    } else {
      this.setBpm(this.bpm)
      this.toggleMetronome(this.isMetronomeActive)
    }
  }

  setBpm(bpm: number) {
    this.bpm = bpm
    this.scheduler.setTempo(bpm)
  }

  runHandlers = (...args: Parameters<ControllerHandler>) => {
    this.handlers.forEach(handler => handler(...args))
  }

  addHandler(fn: ControllerHandler) {
    if (this.handlers.indexOf(fn) > -1) {
      return
    }
    this.handlers.push(fn)
  }

  removeHandler(fn: ControllerHandler) {
    const i = this.handlers.indexOf(fn)
    if (i !== -1) {
      this.handlers.splice(i, 1)
    }
  }

  play() {
    if (this.isPlaying) {
      this.stop()
    }
    this.scheduler.handlers.push(this.runHandlers)
    this.scheduler.schedule()
    this.isPlaying = true
  }

  stop() {
    this.scheduler.stop()
    const i = this.scheduler.handlers.indexOf(this.runHandlers)
    if (i !== -1) {
      this.scheduler.handlers.splice(i, 1)
    }
    this.isPlaying = false
  }

  toggleMetronome(intentState: boolean) {
    this.isMetronomeActive =
      intentState !== undefined ? intentState : !this.isMetronomeActive
    if (this.isMetronomeActive) {
      this.addHandler(this.metronome.handler)
    } else {
      this.removeHandler(this.metronome.handler)
    }
  }

  toJSON() {
    return {
      id: this.id,
      bpm: this.bpm,
      timeSignature: this.timeSignature,
      isMetronomeActive: this.isMetronomeActive,
    }
  }

  fromJSON({ id, bpm, timeSignature, isMetronomeActive }) {
    this.id = id
    this.bpm = bpm
    this.setBpm(this.bpm)
    this.timeSignature = timeSignature
    this.isMetronomeActive = isMetronomeActive
    this.toggleMetronome(this.isMetronomeActive)
  }
}
