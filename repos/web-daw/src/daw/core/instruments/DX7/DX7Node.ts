import dx7wasm from './audiothread/dx7.wasm.js?raw'
import dx7js from './audiothread/dx7.js?raw'
import dx7processorNode from './audiothread/DX7Processor.js?raw'

const loadables = [
  URL.createObjectURL(new Blob([dx7wasm])),
  URL.createObjectURL(new Blob([dx7js])),
  URL.createObjectURL(new Blob([dx7processorNode])),
]

export class DX7Node extends AudioWorkletNode {
  constructor(actx, options) {
    options = options || {}
    options.numberOfInputs = 0
    options.numberOfOutputs = 1
    options.outputChannelCount = [1]

    // The 2nd parameter must match the registerProcessor call on the
    // audiothread side.
    super(actx, 'DX7', options)
  }

  static async importScripts(actx) {
    await Promise.all(
      loadables.map(async loadable => {
        await actx.audioWorklet.addModule(loadable)
      })
    )
  }
}
