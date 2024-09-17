import { EventEmitter } from 'events'

class CSSVars extends EventEmitter {
  variables: { [key: string]: string } = {
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
    '--colors-link': 'var(--primative-colors-blue1)',
    '--font-family': 'Proggy, sans-serif',
    '--base-font-size': '16px',
    '--base-line-height': 'calc(1rem * .9)',
    '--scale-ratio': '1.5',
    '--spacing-xs': 'calc(1rem / var(--scale-ratio))',
    '--spacing-s': 'calc(1rem)',
    '--spacing-m': 'calc(1rem * var(--scale-ratio))',
    '--spacing-l': 'calc(1rem * var(--scale-ratio) * 2)',
    '--spacing-xl': 'calc(1rem * var(--scale-ratio) * 3)',
    '--border': '1px solid var(--colors-fg)'
  }

  set(key: string, value: string) {
    this.variables[key] = value
    this.emit('change')
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
