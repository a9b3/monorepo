import { Subscribable } from '../ui/Subscribable'

type PresetBank = {
  name: string
  url: string
}

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
export class Presets extends Subscribable {
  // All available banks
  banks: PresetBank[]
  selectedBankUrl: string | undefined
  // The currently selected bank
  bank = []
  // All patches contained in the currently selected bank
  patches = []
  selectedPatch: { voice: string; bank: any; idx: number } | undefined
  onPatch: (bank: any) => void | undefined
  loaded: false

  constructor(args?: {
    banks?: PresetBank[]
    selectedBankUrl?: string
    selectedPatch?: { voice: string; idx: number }
    onPatch?: (bank: any) => void | undefined
  }) {
    super()

    args = args || {}
    args.banks = [
      {
        name: '7V1.SYX',
        url: '/content/presets/dx7/7V1.SYX',
      },
      {
        name: '7V2.SYX',
        url: '/content/presets/dx7/7V2.SYX',
      },
      {
        name: 'YAMAHA01.SYX',
        url: '/content/presets/dx7/YAMAHA01.SYX',
      },
      {
        name: 'YAMAHA02.SYX',
        url: '/content/presets/dx7/YAMAHA02.SYX',
      },
      {
        name: 'YAMAHA03.SYX',
        url: '/content/presets/dx7/YAMAHA03.SYX',
      },
      {
        name: 'YAMAHA04.SYX',
        url: '/content/presets/dx7/YAMAHA04.SYX',
      },
      {
        name: 'YAMAHA05.SYX',
        url: '/content/presets/dx7/YAMAHA05.SYX',
      },
      {
        name: 'YAMAHA06.SYX',
        url: '/content/presets/dx7/YAMAHA06.SYX',
      },
      {
        name: 'ENO.syx',
        url: '/content/presets/dx7/ENO.syx',
      },
    ]

    this.banks = args.banks
    this.selectedBankUrl = args.selectedBankUrl
    this.selectedPatch = args.selectedPatch
  }

  async init() {
    if (this.selectedBankUrl) {
      const idx = this.selectedPatch?.idx
      await this.load(this.selectedBankUrl)
      if (idx !== undefined) {
        this.setPatch(idx)
      }
    }
  }

  setOnPatch(onPatch?: (bank: any) => void) {
    this.onPatch = onPatch
  }

  /**
   * Url to a *.syx file
   */
  async load(url: string) {
    this.loaded = false
    this.selectedPatch = undefined
    try {
      this.selectedBankUrl = url
      this.emit('update')
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
      this.loaded = true
      this.emit('update')
    } catch (err) {
      this.selectedBankUrl = undefined
      console.error(err)
      this.emit('update')
    }
    return this.patches
  }

  setPatch(idx: number) {
    this.selectedPatch = {
      voice: this.patches[idx],
      bank: this.bank[idx],
      idx,
    }
    if (this.onPatch) this.onPatch(this.bank[idx])
    this.emit('update')
  }
}
