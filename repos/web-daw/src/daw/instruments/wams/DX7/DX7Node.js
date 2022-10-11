// webDX7 (WAM)
// Jari Kleimola 2017-18 (jari@webaudiomodules.org)

import { WAMController } from 'src/daw/instruments/wams/WAMController'

export class DX7Node extends WAMController {
  constructor(actx, options) {
    options = options || {}
    options.numberOfInputs = 0
    options.numberOfOutputs = 1
    options.outputChannelCount = [1]

    super(actx, 'DX7', options)
  }

  static async importScripts(actx) {
    await actx.audioWorklet.addModule('/public/wamsdk/DX7/wasm/dx7.wasm.js')
    await actx.audioWorklet.addModule('/public/wamsdk/DX7/wasm/dx7.js')
    await actx.audioWorklet.addModule('/public/wamsdk/wam-processor.js')
    await actx.audioWorklet.addModule('/public/wamsdk/DX7/dx7-awp.js')
  }
}
