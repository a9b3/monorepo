import { EventEmitter } from 'events'

/**
 * scheduler.on('tick', SchedulerHandler)
 */
export type SchedulerHandler = (arg0: {
  currentTick: number
  nextTickTime: number
  ticksPerBeat: number
}) => void

/**
 * Handle all scheduling logic here.
 *
 * Completely inspired by
 * https://web.dev/audio-scheduling/
 *
 * ex.
 *
 *    const scheduler = new Scheduler(...)
 *    scheduler.on('tick', (tick) => {
 *      console.log(tick)
 *    })
 *    scheduler.start()
 *    scheduler.stop()
 *
 */
export class Scheduler extends EventEmitter {
  #audioContext: AudioContext
  /**
   * Web worker that is running at an interval for use with scheduling.
   */
  #worker: Worker = null
  #nextTickTime = 0
  #currentTick = 0
  /**
   * millisecond
   */
  readonly lookAhead: number
  /**
   * second
   */
  readonly scheduleAheadTime: number // in seconds
  readonly ticksPerBeat: number
  bpm: number

  constructor(args: {
    bpm: number
    lookAhead?: number
    scheduleAheadTime?: number
    ticksPerBeat?: number
    audioContext: AudioContext
  }) {
    super()

    this.#audioContext = args.audioContext
    this.bpm = args.bpm || 120
    this.lookAhead = args.lookAhead || 25
    this.scheduleAheadTime = args.scheduleAheadTime || 0.1
    this.ticksPerBeat = args.ticksPerBeat || 960
  }

  #advanceNote() {
    const secondsPerBeat = 60.0 / this.bpm
    this.#nextTickTime += (1 / this.ticksPerBeat) * secondsPerBeat
    this.#currentTick += 1
  }

  #scheduleNote() {
    this.emit('tick', {
      currentTick: this.#currentTick,
      nextTickTime: this.#nextTickTime,
      ticksPerBeat: this.ticksPerBeat,
    })
  }

  #schedule() {
    while (
      this.#nextTickTime <
      this.#audioContext.currentTime + this.scheduleAheadTime
    ) {
      this.#scheduleNote()
      this.#advanceNote()
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
    this.#nextTickTime = this.#audioContext.currentTime
    this.#worker.postMessage({ type: 'start' })
  }

  stop() {
    if (this.#worker) {
      this.#worker.postMessage({ type: 'stop' })
    }
  }
}
