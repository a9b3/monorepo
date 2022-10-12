import { writable } from 'svelte/store'

// TODO local storage
export const userStore = writable({ id: 'me' })

export default userStore
