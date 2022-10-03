import { writable } from 'svelte/store'
import { Mixer } from 'src/daw'

const mixer = new Mixer()
const mixerStore = writable(mixer)

export default mixerStore
