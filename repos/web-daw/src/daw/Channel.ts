import type { UnitInterface } from './UnitInterface'
import { audioContext } from './audioContext'
import { FxChain } from './FxChain'
import { Analyser } from './Analyser'

export interface ChannelConstructorArgs {
  id?: string
  gain?: number
  isMute?: boolean
  panPosition?: number
}

/**
 * This is the order in which the dry signal will go through the chain.
 *
 * External Source
 *  -> input
 *  -> fx[]
 *  -> sends.preFader[]
 *  -> fader
 *  -> sends.postFader[]
 *  -> panner
 *  -> sends.postPan[]
 *  -> output
 *  -> External Source
 *
 */
export class Channel implements UnitInterface {
  id: string

  // Fader settings
  gain: number
  isMute: boolean

  // Pan settings
  panPosition = 0

  // TODO add sends logic
  sends: {
    // Before fader and before pan
    ['preFader']: {
      [key: string]: UnitInterface
    }
    // After fader and before pan
    ['postFader']: {
      [key: string]: UnitInterface
    }
    // (Default) After fader and after pan
    ['postPan']: {
      [key: string]: UnitInterface
    }
  }

  input: GainNode = audioContext.createGain()
  fader: GainNode = audioContext.createGain()
  stereoPanner: StereoPannerNode = audioContext.createStereoPanner()
  // Order matters for the fx chain.
  fx: FxChain = new FxChain()
  output: GainNode = audioContext.createGain()

  analyser = new Analyser()

  constructor({
    id = crypto.randomUUID(),
    gain = 1,
    isMute = false,
    panPosition = 0,
  }: ChannelConstructorArgs = {}) {
    if (id) this.id = id
    if (gain) this.setGain(gain)
    if (isMute) this.toggleMute(isMute)
    if (panPosition) this.panPosition = panPosition

    this.input.connect(this.fx.input)
    this.fx.connect(this.fader)
    this.fader.connect(this.stereoPanner)
    this.stereoPanner.connect(this.output)
    this.setPan(this.panPosition)

    this.connect(this.analyser)
  }

  connect(unit: UnitInterface | AudioNode) {
    this.output.connect(unit instanceof AudioNode ? unit : unit.input)
  }

  disconnect(unit?: UnitInterface | AudioNode) {
    if (unit) {
      this.output.disconnect(unit instanceof AudioNode ? unit : unit.input)
    } else {
      // TODO clean up sends here too
      this.output.disconnect()
    }
  }

  setPan(value: number) {
    this.panPosition = value
    this.stereoPanner.pan.setValueAtTime(value, audioContext.currentTime)
  }

  setGain(value: number) {
    this.gain = value
    this.fader.gain.setValueAtTime(value, audioContext.currentTime)
  }

  toggleMute(muteState = !this.isMute) {
    if (muteState) {
      this.fader.gain.setValueAtTime(0, audioContext.currentTime)
    } else {
      this.fader.gain.setValueAtTime(this.gain, audioContext.currentTime)
    }
    this.isMute = muteState
  }
}
