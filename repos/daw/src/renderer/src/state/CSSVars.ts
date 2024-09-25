import { EventEmitter } from 'events'

class CSSVars {
  emitter = new EventEmitter()

  constructor() {
    this.emitter.setMaxListeners(0)
  }

  variables: { [key: string]: string } = {
    // Primitives
    '--primative-colors-grey1': '#343434',
    '--primative-colors-grey2': '#343434',
    '--primative-colors-grey3': '#393939',
    '--primative-colors-grey4': '#474747',
    '--primative-colors-grey5': '#808080',
    '--primative-colors-grey6': '#dddddd',
    '--primative-colors-grey7': '#000000',
    '--primative-colors-green1': '#030e04',
    '--primative-colors-yellow1': '#febb2e',
    '--primative-colors-red1': '#ff5f57',
    '--primative-colors-blue1': '#3894ff',
    '--primative-colors-white1': '#ffffff',

    // Semantics
    '--colors-bg': 'var(--primative-colors-white1)',
    '--colors-fg': 'var(--primative-colors-grey1)',
    '--colors-fg2': 'var(--primative-colors-grey3)',
    '--colors-fg3': 'var(--primative-colors-grey6)',
    '--colors-hl': 'var(--primative-colors-yellow1)',
    '--colors-link': 'var(--primative-colors-blue1)',
    '--border': '1px solid var(--colors-fg)',

    // Spacing
    '--scale-ratio': '1.5',
    '--spacing-xxs': 'calc(1rem / calc(var(--scale-ratio) * 5))',
    '--spacing-xs': 'calc(1rem / var(--scale-ratio))',
    '--spacing-s': 'calc(1rem)',
    '--spacing-m': 'calc(1rem * var(--scale-ratio))',
    '--spacing-l': 'calc(1rem * var(--scale-ratio) * 2)',
    '--spacing-xl': 'calc(1rem * var(--scale-ratio) * 3)',

    // Font
    '--font-family': 'Proggy, sans-serif',
    '--base-font-size': '16px',
    '--base-line-height': 'calc(1rem * .9)',
    '--font-scale-ratio': '1.5',
    '--font-size-h6': 'calc(var(--base-font-size) * var(--font-scale-ratio))',
    '--font-size-h5': 'calc(var(--font-size-h6) * var(--font-scale-ratio))',
    '--font-size-h4': 'calc(var(--font-size-h5) * var(--font-scale-ratio))',
    '--font-size-h3': 'calc(var(--font-size-h4) * var(--font-scale-ratio))',
    '--font-size-h2': 'calc(var(--font-size-h3) * var(--font-scale-ratio))',
    '--font-size-h1': 'calc(var(--font-size-h2) * var(--font-scale-ratio))'
  }

  set(key: string, value: string) {
    this.variables[key] = value
    this.emitter.emit('*')
  }

  setAndApply(key: string, value: string) {
    this.set(key, value)
    this.applyVariables()
  }

  applyVariables(rootEl: HTMLElement = document.documentElement) {
    for (const [key, value] of Object.entries(this.variables)) {
      rootEl.style.setProperty(key, value)
    }
  }

  toJSON() {
    return JSON.stringify(this.variables)
  }
}

export default new CSSVars()
