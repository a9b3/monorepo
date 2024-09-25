import ThemeManager from '@renderer/src/app/lib/theme/ThemeManager'
import { writable } from 'svelte/store'

export const theme = new ThemeManager()

const { subscribe, update } = writable<{
  theme: ThemeManager
}>({
  theme: theme
})

theme.emitter.on('*', () => {
  update((state) => {
    state.theme = theme
    return state
  })
})

export default {
  subscribe
}
