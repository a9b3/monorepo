function extractName(data: Uint8Array, offset = 118) {
  let name = ''
  for (let n = 0; n < 10; n += 1) {
    let c = data[n + offset]
    switch (c) {
      case 92:
        c = 'Y'
        break // yen
      case 126:
        c = '>'
        break // >>
      case 127:
        c = '<'
        break // <<
      default:
        if (c < 32 || c > 127) c = 32
        break
    }
    name += String.fromCharCode(c)
  }
  return name
}

/**
 * Loads syx files into banks and patches
 */
export class Presets {
  // All available banks
  banks = []
  // The currently selected bank
  bank = []
  // All patches contained in the currently selected bank
  patches = []

  /**
   * Url to a *.syx file
   */
  async load(url: string) {
    const res = await fetch(url)
    const data = await res.arrayBuffer()
    if (data.byteLength !== 4104) {
      throw new Error('Not a valid sys file')
    }
    this.patches = []
    this.bank = []
    const uintArr = new Uint8Array(data)
    const parsedUintArr = uintArr.subarray(6, 4102)
    for (let i = 0; i < 32; i += 1) {
      const offset = i * 128
      const voice = parsedUintArr.subarray(offset, offset + 128)
      const name = extractName(voice)
      this.patches.push(name)
      this.bank.push(voice)
    }
    return this.patches
  }
}
