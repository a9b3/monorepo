import cssVars from '@renderer/src/state/CSSVars'
import { writable } from 'svelte/store'

const { subscribe, update } = writable<{
  cssVars: typeof cssVars
}>({
  cssVars: cssVars
})

cssVars.pubsub.subscribe('*', () => {
  update((state) => {
    state.cssVars = cssVars
    return state
  })
})

export default {
  subscribe
}