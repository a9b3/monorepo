import { Metronome } from 'daw/core/customNodes'
import { Scheduler } from 'daw/core/scheduler'
import { Subscribable } from './Subscribable'

export interface ControllerPosition {
  cursor: number
  lastStartTime: number
  lastStopTime: number
}

/**
 * Controller houses the logic for the scheduler and play time information.
 */
export class Controller extends Subscribable {
  beatsPerBeat: number
  barsPerMeasure: number
  bpm: number

  #metronome: Metronome
  scheduler: Scheduler
  /**
   * In ticks.
   */
  position: ControllerPosition
  isPlaying: boolean
  isMetronomeActive: boolean

  constructor(args: {
    audioContext: AudioContext
    scheduler?: Omit<
      ConstructorParameters<typeof Scheduler>[0],
      'bpm' | 'audioContext'
    >
    beatsPerBeat?: number
    barsPerMeasure?: number
    position?: ControllerPosition
    isMetronomeActive?: boolean
    bpm?: number
  }) {
    super()

    this.scheduler = new Scheduler({
      ...(args.scheduler || {}),
      bpm: args.bpm || 120,
      audioContext: args.audioContext,
    })
    this.#metronome = new Metronome({
      audioContext: args.audioContext,
      ticksPerBeat: this.scheduler.ticksPerBeat,
    })
    this.beatsPerBeat = args.beatsPerBeat || 4
    this.barsPerMeasure = args.barsPerMeasure || 4
    this.position = args.position || {
      cursor: 0,
      lastStartTime: 0,
      lastStopTime: 0,
    }
    this.setIsMetronomeActive(args.isMetronomeActive)
    this.isPlaying = false
    this.setBpm(args.bpm || 120)
  }

  #onschedulertick = args => {
    this.emit('tick', args)
  }

  play() {
    if (this.isPlaying) {
      this.stop()
    }
    this.scheduler.start(this.position.cursor)
    this.isPlaying = true

    this.emit('play')
    this.emit('update')

    this.scheduler.on('tick', this.#onschedulertick)
  }

  stop() {
    this.scheduler.stop()
    this.isPlaying = false

    this.emit('stop')
    this.emit('update')

    this.scheduler.removeListener('tick', this.#onschedulertick)
  }

  setIsMetronomeActive(intentState = !this.isMetronomeActive) {
    this.isMetronomeActive = intentState
    if (this.isMetronomeActive) {
      this.scheduler.on('tick', this.#metronome.onTick)
    } else {
      this.scheduler.removeListener('tick', this.#metronome.onTick)
    }

    this.emit('update')
  }

  setBpm(bpm: number) {
    this.bpm = bpm
    this.scheduler.bpm = bpm

    this.emit('update')
  }
}
