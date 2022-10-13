import { Sampler, DX7 } from 'daw/core/instruments'
import type { Instrument } from 'daw/core/instruments'
import { MidiClip } from 'daw/core/midi'
import { Subscribable } from './Subscribable'
import type { SchedulerHandler } from 'daw/core/scheduler'

export class Track extends Subscribable {
  #audioContext: AudioContext
  id: string
  label: string
  color: string | undefined

  /**
   * Bank of all midi clips created for this track. This can be shared between
   * clip view and arrangement view.
   */
  midiClips: { [id: string]: MidiClip }
  /**
   * Used by clip view reference to the currently looping clip's id
   */
  activeMidiClip: string | undefined
  /**
   * Used by clip view to display which slot a clip is in. Indexed by array
   * number and value is the midi clip id.
   */
  midiClipOrder: { [idx: string]: string }

  // TODO need to create a instrument service which contains these enums
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
    midiClipOrder?: { [idx: string]: string }

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
    this.midiClips = Object.fromEntries(
      Object.entries(args.midiClips || {}).map(([key, val]) => {
        return [key, new MidiClip({ ...val })]
      })
    )
    this.activeMidiClip = args.activeMidiClip
    this.midiClipOrder = args.midiClipOrder || {}
    this.channelId = args.channelId
    this.player = args.player
    this.output = this.#audioContext.createGain()

    if (args.instrument) {
      this.addInstrument(args.instrumentType, args.instrument)
    } else {
      // TODO remove this, default to this for now
      this.addInstrument('DX7', {})
    }
  }

  addInstrument = (instrumentType: string, instrument: any) => {
    if (this.instrument) {
      this.instrument.disconnect()
    }
    switch (instrumentType) {
      case 'Sampler':
        this.instrumentType = instrumentType
        this.instrument = new Sampler({
          ...instrument,
          audioContext: this.#audioContext,
        })
        this.instrument.connect(this.output)
        break
      case 'DX7':
        this.instrumentType = instrumentType
        this.instrument = new DX7({
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

  addMidiClip = (
    idx: number,
    args?: ConstructorParameters<typeof MidiClip>[0]
  ) => {
    const id = crypto.randomUUID()
    const midiClip = new MidiClip({
      id,
      ...args,
    })
    this.midiClips[midiClip.id] = midiClip
    this.midiClipOrder[idx] = midiClip.id

    this.emit('update')

    return midiClip
  }

  removeMidiClip = (idx: number) => {
    delete this.midiClipOrder[idx]

    this.emit('update')
  }

  setActiveMidiClip = (id?: string) => {
    this.activeMidiClip = id

    this.emit('update')
  }

  setLabel = (label: string) => {
    this.label = label

    this.emit('update')
  }

  setColor = (color: string) => {
    this.color = color

    this.emit('update')
  }

  /**
   * Handler for scheduler
   */
  onTick: SchedulerHandler = arg => {
    const midiClip = this.midiClips[this.activeMidiClip]
    if (!midiClip) {
      return
    }
    const offsetTick =
      arg.currentTick % (midiClip.beatsPerLoop * arg.ticksPerBeat)
    const tickEvents = midiClip?.eventsMap[offsetTick]

    if (!tickEvents) {
      return
    }
    const noteEvents = Object.values(tickEvents)

    noteEvents.forEach(events => {
      console.log('arg', arg)
      Object.values(events).forEach(event => {
        this.instrument.onMidi({ ...event, nextTickTime: arg.nextTickTime })
      })
    })
  }
}
