import { Analyser } from '../customNodes/Analyser'
import { percentToGain, gainToPercent } from '../../utils/volumeControl'
import { IONode } from './IONode'
import { Effects } from './Effects'

/**
 * This is the order in which the dry signal will go through the chain.
 *
 *    -> input
 *    -> effects[]
 *    -> sends.preFader[]
 *    -> fader
 *    -> sends.postFader[]
 *    -> panner
 *    -> sends.postPan[]
 *    -> output
 *
 */
export class Channel extends IONode {
  #audioContext: AudioContext

  readonly id: string

  name: string
  gain: number
  isMute: boolean
  isSolo: boolean
  isRecord: boolean
  panPosition = 0

  fader: GainNode
  stereoPanner: StereoPannerNode
  // Order matters for the effects chain.
  effects: IONode
  analyser: Analyser
  sends: {
    // Before fader and before pan
    ['preFader']: {
      [key: string]: IONode
    }
    // After fader and before pan
    ['postFader']: {
      [key: string]: IONode
    }
    // (Default) After fader and after pan
    ['postPan']: {
      [key: string]: IONode
    }
  } = {
    preFader: {},
    postFader: {},
    postPan: {},
  }

  constructor(args: {
    audioContext: AudioContext
    id: string
    gain?: number
    isMute?: boolean
    isRecord?: boolean
    isSolo?: boolean
    panPosition?: number
    name?: string
  }) {
    super(args.audioContext)

    // Create the Audio Nodes
    this.#audioContext = args.audioContext
    this.fader = this.#audioContext.createGain()
    this.stereoPanner = this.#audioContext.createStereoPanner()
    this.effects = new Effects({ audioContext: args.audioContext })
    this.analyser = new Analyser(args.audioContext)

    this.id = args.id
    this.name = args.name || 'Untitled'
    this.setGain(args.gain || 0.9)
    this.setIsMute(args.isMute || false)
    this.setIsSolo(args.isSolo || false)
    this.setIsRecord(args.isRecord || false)
    this.setPanPosition(args.panPosition || 0)

    // Connect the chain.
    this.input.connect(this.effects.input)
    this.effects.connect(this.fader)
    this.fader.connect(this.stereoPanner)
    this.stereoPanner.connect(this.output)

    this.connect(this.analyser.input)
  }

  setPanPosition(value: number) {
    this.panPosition = value
    this.stereoPanner.pan.setValueAtTime(value, this.#audioContext.currentTime)

    this.emit('update')
  }

  setGain(value: number) {
    this.gain = percentToGain(value)
    this.fader.gain.setValueAtTime(value, this.#audioContext.currentTime)

    this.emit('update')
  }

  get percentGain() {
    return gainToPercent(this.gain)
  }

  setIsMute(muteState = !this.isMute) {
    if (muteState) {
      this.fader.gain.setValueAtTime(0, this.#audioContext.currentTime)
    } else {
      this.fader.gain.setValueAtTime(this.gain, this.#audioContext.currentTime)
    }
    this.isMute = muteState

    this.emit('update')
  }

  setIsSolo(soloState = !this.isSolo, skipEmit = false) {
    this.isSolo = soloState

    if (!skipEmit) {
      this.emit('solo', this.id, soloState)
    }
    this.emit('update')
  }

  setIsRecord(recordState = !this.isRecord) {
    this.isRecord = recordState
    this.emit('update')
  }
}
