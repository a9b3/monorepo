import type { UnitInterface } from 'src/daw/UnitInterface'
import type { InstrumentInterface } from 'src/daw/instruments/InstrumentInterface'
import type { ClipHandlerArg } from 'src/daw/Clip'
import { audioContext } from 'src/daw/audioContext'
import { SoundSource } from 'src/daw/SoundSource'
import type { SoundSourceConstructorArgs } from 'src/daw/SoundSource'
import { EventEmitter } from 'events'

export type Samples = { [frequency: string]: SoundSource }
export interface MPCConstructorArgs {
  samples?: { [k: string]: SoundSourceConstructorArgs }
}

export class MPC extends EventEmitter implements InstrumentInterface {
  // keyed by frequency
  samples: { [frequency: string]: SoundSource } = {}
  input: GainNode = audioContext.createGain()
  output: GainNode = audioContext.createGain()

  constructor(arg?: MPCConstructorArgs) {
    super()
    if (arg && arg.samples) {
      Object.entries(arg.samples).forEach(([key, val]) => {
        this.addSoundSource(key, val)
      })
    }
    this.input.connect(this.output)
  }

  connect(unit: UnitInterface | AudioNode): void {
    this.output.connect(unit instanceof AudioNode ? unit : unit.input)
  }

  disconnect(unit?: UnitInterface | AudioNode): void {
    if (unit) {
      this.output.disconnect(unit instanceof AudioNode ? unit : unit.input)
    } else {
      this.output.disconnect()
    }
  }

  async addSoundSource(frequency: string, arg: SoundSourceConstructorArgs) {
    this.emit('update')
    this.removeSoundSource(frequency)

    const soundSource = new SoundSource(arg)
    soundSource.connect(this.input)
    this.samples[frequency] = soundSource
    await this.samples[frequency].load(arg.url, arg.name)
    this.emit('update')
  }

  removeSoundSource(frequency: string) {
    if (this.samples[frequency]) {
      this.samples[frequency].disconnect()
    }
    delete this.samples[frequency]
    this.emit('update')
  }

  handler = ({ nextTickTime, note }: ClipHandlerArg) => {
    const sample = this.samples[String(note.frequency)]
    if (!sample) {
      return
    }
    if (!sample.ready) {
      return
    }

    sample.play({ startTime: nextTickTime })
  }

  subscribe = (listener: (state: this) => void) => {
    listener(this)
    const invokeListener = () => {
      listener(this)
    }
    this.on('update', invokeListener)

    return () => {
      this.removeListener('update', invokeListener)
    }
  }
}
