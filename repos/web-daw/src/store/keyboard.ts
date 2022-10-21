import { writable } from 'svelte/store'
import { KeyboardManager } from 'src/ui'

export const keyboardStore = new KeyboardManager()

export const showHelp = writable(false)
