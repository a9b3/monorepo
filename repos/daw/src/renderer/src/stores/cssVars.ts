import cssVars from '@renderer/src/state/CSSVars'
import { writable } from 'svelte/store'

const { subscribe, update } = writable<{
  cssVars: typeof cssVars
}>({
  cssVars: cssVars
})

cssVars.emitter.on('*', () => {
  update((state) => {
    state.cssVars = cssVars
    return state
  })
})

export default {
  subscribe
}
