// webDX7 (WAM)
// Jari Kleimola 2017-18 (jari@webaudiomodules.org)

class DX7AWP extends AudioWorkletProcessor {
  constructor(options) {
    options = options || {}
    // the wasm module
    options.mod = AudioWorkletGlobalScope.WAM.DX7
    this.numOutChannels = [1]

    this.port.onmessage = this.onmessage.bind(this)
    this.port.start()
  }

  onmessage(e) {
    var msg = e.data
    var data = msg.data
    var startTime = msg.startTime
    switch (msg.type) {
      case 'midi':
        this.onmidi(data[0], data[1], data[2], startTime)
        break
      case 'sysex':
        this.onsysex(data)
        break
      case 'patch':
        this.onpatch(data)
        break
      case 'param':
        this.onparam(msg.key, msg.value)
        break
      case 'msg':
        this.onmsg(msg.verb, msg.prop, msg.data)
        break
      //case "osc":   this.onmsg(msg.prop, msg.type, msg.data); break;
    }
  }

  process(inputs, outputs, params) {
    var WAM = this.WAM

    // -- inputs
    for (var i = 0; i < this.numInputs; i++) {
      var waain = inputs[i][0]
      var wamin = this.audiobufs[0][i]
      WAM.HEAPF32.set(waain, wamin)
    }

    this.wam_onprocess(this.inst, this.audiobus, 0)

    // -- outputs
    for (var i = 0; i < this.numOutputs; i++) {
      var numChannels = this.numOutChannels[i]
      for (var c = 0; c < numChannels; c++) {
        var waaout = outputs[i][c]
        var wamout = this.audiobufs[1][i * numChannels + c]
        waaout.set(WAM.HEAPF32.subarray(wamout, wamout + this.bufsize))
      }
    }

    return true
  }
}

registerProcessor('DX7', DX7AWP)
