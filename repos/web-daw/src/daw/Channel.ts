import { UnitInterface } from './UnitInterface'
import { audioContext } from './audioContext'
import { FxChain } from './FxChain'

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
  id: string = crypto.randomUUID()
  label: string = 'Untitled'

  input: GainNode = audioContext.createGain()

  // Order matters for the fx chain.
  fx: FxChain = new FxChain()

  // Fader settings
  gain: number = 1
  fader: GainNode = audioContext.createGain()
  isMute: boolean = false

  // Pan settings
  panPosition: number = 0
  stereoPanner: StereoPannerNode = audioContext.createStereoPanner()

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
  output: GainNode = audioContext.createGain()

  constructor({ label }: { label?: string }) {
    if (label) {
      this.label = label
    }

    this.input.connect(this.fx.input)
    this.fx.connect(this.fader)
    this.fader.connect(this.stereoPanner)
    this.stereoPanner.connect(this.output)
    this.setPan(this.panPosition)
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

  toggleMute(muteState: boolean = !this.isMute) {
    if (muteState) {
      this.fader.gain.setValueAtTime(0, audioContext.currentTime)
    } else {
      this.fader.gain.setValueAtTime(this.gain, audioContext.currentTime)
    }
    this.isMute = muteState
  }
}
