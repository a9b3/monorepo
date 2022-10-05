import { EventEmitter } from 'events'
import { Metronome } from './Metronome'
import type { SchedulerConstructorArgs, SchedulerHandler } from './Scheduler'
import { Scheduler } from './Scheduler'

export interface TimeSignature {
  top: number
  bottom: number
}

export interface ControllerPosition {
  cursor: number
  lastStartTime: number
  lastStopTime: number
}

export interface ControllerConstructorArgs {
  scheduler?: SchedulerConstructorArgs
  id?: string
  bpm?: number
  position?: ControllerPosition
  timeSignature?: TimeSignature
  isMetronomeActive?: boolean
}

/**
 * Controller houses the logic for the scheduler and play time information.
 */
export class Controller extends EventEmitter {
  #metronome: Metronome
  #handlers: SchedulerHandler[] = []

  scheduler: Scheduler
  id = crypto.randomUUID()
  bpm = 120
  timeSignature: TimeSignature = {
    top: 4,
    bottom: 4,
  }
  position: ControllerPosition = {
    cursor: 0,
    lastStartTime: 0,
    lastStopTime: 0,
  }
  isPlaying = false
  isMetronomeActive = true

  constructor({
    scheduler,
    id = crypto.randomUUID(),
    bpm = 120,
    position = {
      cursor: 0,
      lastStartTime: 0,
      lastStopTime: 0,
    },
    timeSignature = {
      top: 4,
      bottom: 4,
    },
    isMetronomeActive = true,
  }: ControllerConstructorArgs) {
    super()

    this.#metronome = new Metronome()
    this.scheduler = new Scheduler(scheduler)
    this.id = id
    if (timeSignature) this.timeSignature = timeSignature
    if (position) this.position = position
    this.setBpm(bpm)
    this.toggleMetronome(isMetronomeActive)
  }

  setBpm(bpm: number) {
    this.bpm = bpm
    this.scheduler.setBpm(bpm)
  }

  #runHandlers = (...args: Parameters<SchedulerHandler>) => {
    this.#handlers.forEach(handler => handler(...args))
  }

  addHandler(fn: SchedulerHandler) {
    if (this.#handlers.indexOf(fn) > -1) {
      return
    }
    this.#handlers.push(fn)
  }

  removeHandler(fn: SchedulerHandler) {
    const i = this.#handlers.indexOf(fn)
    if (i !== -1) {
      this.#handlers.splice(i, 1)
    }
  }

  play() {
    if (this.isPlaying) {
      this.stop()
    }
    this.scheduler.addHandler(this.#runHandlers)
    this.scheduler.start(this.position.cursor)
    this.isPlaying = true
  }

  stop() {
    this.scheduler.stop()
    this.scheduler.removeHandler(this.#runHandlers)
    this.isPlaying = false
  }

  toggleMetronome(intentState: boolean) {
    this.isMetronomeActive =
      intentState !== undefined ? intentState : !this.isMetronomeActive
    if (this.isMetronomeActive) {
      this.addHandler(this.#metronome.handler)
    } else {
      this.removeHandler(this.#metronome.handler)
    }
  }
}
