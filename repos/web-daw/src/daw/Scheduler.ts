import { audioContext } from './audioContext'

export interface SchedulerConstructorArgs {
  bpm: number
  lookAhead?: number
  scheduleAheadTime?: number
  ticksPerBeat?: number
}

export type SchedulerHandler = (SchedulerHandler: {
  currentTick: number
  nextTickTime: number
  ticksPerBeat: number
}) => void

/**
 * Handle all scheduling logic here.
 *
 * Usage.
 * const scheduler = new Scheduler({ bpm: 120 })
 * const handler = ({currentTick, nextTickTime, ticksPerBeat}) => {}
 * scheduler.addHandler(handler)
 * scheduler.start(0)
 * scheduler.stop()
 * scheduler.removeHandler(handler)
 */
export class Scheduler {
  #worker = null
  #nextTickTime = 0
  #currentTick = 0
  #handlers = []

  lookAhead = 25 // ms
  scheduleAheadTime = 0.1 // in seconds
  bpm: number
  ticksPerBeat = 480 // resolution, ex. 8 would be 8 ticks per beat meaning each tick is a 32nd note

  constructor(
    {
      bpm,
      lookAhead,
      scheduleAheadTime,
      ticksPerBeat,
    }: SchedulerConstructorArgs = {
      bpm: 120,
    }
  ) {
    this.setBpm(bpm)
    if (lookAhead) this.lookAhead = lookAhead
    if (scheduleAheadTime) this.scheduleAheadTime = scheduleAheadTime
    if (ticksPerBeat) this.ticksPerBeat = ticksPerBeat
  }

  #advanceNote() {
    const secondsPerBeat = 60.0 / this.bpm
    this.#nextTickTime += (1 / this.ticksPerBeat) * secondsPerBeat
    this.#currentTick += 1
  }

  #scheduleNote() {
    this.#handlers.forEach(handler =>
      handler({
        currentTick: this.#currentTick,
        nextTickTime: this.#nextTickTime,
        ticksPerBeat: this.ticksPerBeat,
      })
    )
  }

  #schedule() {
    while (
      this.#nextTickTime <
      audioContext.currentTime + this.scheduleAheadTime
    ) {
      this.#scheduleNote()
      this.#advanceNote()
    }
  }

  addHandler(handler: SchedulerHandler) {
    if (this.#handlers.indexOf(handler) === -1) {
      this.#handlers.push(handler)
    }
  }

  removeHandler(handler: SchedulerHandler) {
    const idx = this.#handlers.indexOf(handler)
    if (idx > -1) {
      this.#handlers.splice(idx, 1)
    }
  }

  start(startTick = 0) {
    if (!this.#worker) {
      this.#worker = new Worker(new URL('./IntervalWorker.js', import.meta.url))

      this.#worker.onmessage = ({ data }) => {
        if (data === 'tick') {
          this.#schedule()
        }
      }
      this.#worker.postMessage({ type: 'setInterval', args: this.lookAhead })
    }

    this.#currentTick = startTick
    this.#nextTickTime = audioContext.currentTime
    this.#worker.postMessage({ type: 'start' })
  }

  stop() {
    this.#worker.postMessage({ type: 'stop' })
  }

  setBpm(bpm: number) {
    this.bpm = bpm
  }
}
