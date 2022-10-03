import { readable, writable, derived } from 'svelte/store'
import { Project } from './editor'

const project = new Project()
const writableProject = writable(project)
const { subscribe } = writableProject

export function addClipTrack() {
  project.addClipTrack()
  writableProject.update(() => project)
}

export function removeClipTrack(idx) {
  project.removeClipTrack(idx)
  writableProject.update(() => project)
}

export default {
  subscribe,
}
