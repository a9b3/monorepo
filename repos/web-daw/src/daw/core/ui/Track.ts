import { Sampler, Instrument } from 'daw/core/instruments'
import { MidiClip } from 'daw/core/midi'
import { Subscribable } from './Subscribable'

export class Track extends Subscribable {
  #audioContext: AudioContext
  id: string
  label: string
  color: string | undefined

  midiClips: { [id: string]: MidiClip }
  activeMidiClip: string | undefined
  midiClipOrder: string[]

  instrumentType: 'Sampler' | 'DX7'
  instrument: Instrument | undefined
  /**
   * The channel that this track is connected to.
   */
  channelId: string | undefined
  player: string | undefined
  output: GainNode

  constructor(args: {
    audioContext: AudioContext
    id: string
    label?: string
    color?: string
    midiClips?: { [id: string]: ConstructorParameters<typeof MidiClip>[0] }
    activeMidiClip?: string
    midiClipOrder?: string[]

    instrumentType?: 'Sampler' | 'DX7'
    instrument?: any
    channelId?: string
    player?: string
  }) {
    super()

    this.#audioContext = args.audioContext
    this.id = args.id
    this.label = args.label || 'Untitled'
    this.color = args.color
    this.midiClips =
      Object.fromEntries(
        Object.entries(([key, val]) => {
          return [key, new MidiClip({ ...val })]
        })
      ) || {}
    this.activeMidiClip = args.activeMidiClip
    this.midiClipOrder = args.midiClipOrder || []
    this.channelId = args.channelId
    this.player = args.player
    this.output = this.#audioContext.createGain()
    this.addInstrument(args.instrumentType, args.instrument)
  }

  addInstrument(instrumentType: string, instrument: any) {
    switch (instrumentType) {
      case 'Sampler':
        this.instrumentType = instrumentType
        this.instrument = new Sampler({
          ...instrument,
          audioContext: this.#audioContext,
        })
        this.instrument.connect(this.output)
        break
      default:
        return
    }

    this.emit('update')
  }

  setLabel(label: string) {
    this.label = label

    this.emit('update')
  }

  setColor(color: string) {
    this.color = color

    this.emit('update')
  }

  /**
   * Handler for scheduler
   */
  onTick = (currentTick: number) => {
    const midiEvent =
      this.midiClips[this.activeMidiClip]?.eventsMap[currentTick]
    if (midiEvent && this.instrument) {
      this.instrument.onMidi(midiEvent)
    }
  }
}
