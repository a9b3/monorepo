import { writable } from 'svelte/store'

// TODO local storage
const userStore = writable({ id: 'me' })

export default userStore
