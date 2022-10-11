import { SoundSource } from 'daw/core/customNodes'
import { IONode } from 'daw/core/mixer'
import type { Instrument } from './interface'

// keyed by midi note 0-127
export type Samples = { [note: string]: SoundSource }

export class Sampler extends IONode implements Instrument {
  #audioContext: AudioContext
  // keyed by midi note 0-127
  samples: Samples

  constructor(args: {
    audioContext: AudioContext
    samples?: {
      [note: string]: Omit<
        ConstructorParameters<typeof SoundSource>[0],
        'audioContext'
      >
    }
  }) {
    super(args.audioContext)

    this.#audioContext = args.audioContext
    this.output = args.audioContext.createGain()
    if (args.samples) {
      Object.entries(args.samples).forEach(([key, val]) => {
        this.addSoundSource(key, { ...val, audioContext: args.audioContext })
      })
    }
  }

  async addSoundSource(
    note: string,
    arg: ConstructorParameters<typeof SoundSource>[0]
  ) {
    this.removeSoundSource(note)
    const soundSource = new SoundSource({
      ...arg,
      audioContext: this.#audioContext,
    })
    soundSource.connect(this.output)
    this.samples[note] = soundSource
    await soundSource.load(arg.url, arg.name)

    this.emit('update')
  }

  removeSoundSource(note: string) {
    if (this.samples[note]) {
      this.samples[note].disconnect()
    }
    this.samples[note].unload()
    delete this.samples[note]

    this.emit('update')
  }

  onMidi = (e: WebMidi.MIDIMessageEvent) => {
    const sample = this.samples[String(note)]
    if (type === 144) {
      sample.play()

      this.emit('update')
    }
  }
}
