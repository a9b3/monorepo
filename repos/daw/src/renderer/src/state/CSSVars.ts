import { EventEmitter } from 'events'

class CSSVars extends EventEmitter {
  variables: { [key: string]: string } = {
    // Primative colors
    '--primative-colors-grey1': '#343434',
    '--primative-colors-grey2': '#343434',
    '--primative-colors-grey3': '#393939',
    '--primative-colors-grey4': '#474747',
    '--primative-colors-grey5': '#808080',
    '--primative-colors-grey6': '#dddddd',
    '--primative-colors-grey7': '#000000',
    '--primative-colors-green1': '#27c840',
    '--primative-colors-yellow1': '#febb2e',
    '--primative-colors-red1': '#ff5f57',
    '--primative-colors-blue1': '#3894ff',
    '--primative-colors-white1': '#ffffff',

    // Semantic colors
    '--semantic-colors-system-background': 'var(--primative-colors-grey7)',
    '--semantic-colors-system-font': 'var(--primative-colors-green1)',
    '--semantic-colors-system-green': 'var(--primative-colors-green1)',
    '--semantic-colors-system-yellow': 'var(--primative-colors-yellow1)',
    '--semantic-colors-system-red': 'var(--primative-colors-red1)',
    '--semantic-colors-background': 'var(--primative-colors-grey7)',
    '--semantic-colors-background1': 'var(--primative-colors-white1)',
    '--semantic-colors-surface': 'var(--primative-colors-grey1)',
    '--semantic-colors-surface1': 'var(--primative-colors-grey2)',
    '--semantic-colors-surface2': 'var(--primative-colors-grey3)',
    '--semantic-colors-link': 'var(--primative-colors-blue1)',
    '--semantic-font-family': 'Proggy, sans-serif',

    // Spacing
    '--spacing-s': '1',
    '--spacing-xs': '1'
  }

  set(key: string, value: string) {
    this.variables[key] = value
    this.emit('change')
  }

  setAndApply(key: string, value: string) {
    console.log(`Setting ${key} to ${value}`)
    this.set(key, value)
    this.applyVariables()
  }

  applyVariables(rootEl: HTMLElement = document.documentElement) {
    for (const [key, value] of Object.entries(this.variables)) {
      rootEl.style.setProperty(key, value)
    }
  }
}

export default new CSSVars()
