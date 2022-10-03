import { writable } from 'svelte/store'
import type { ProjectT } from 'src/database/project'

interface LocalStore {
  openedProjects: ProjectT[]
  selectedProjectId: string | undefined
  inFocusElement: string | undefined
}

const localStore = writable<LocalStore>({
  openedProjects: [],
  selectedProjectId: undefined,
  inFocusElement: undefined,
})

export function addOpenedProject(project: ProjectT) {
  localStore.update(prev => {
    if (prev.openedProjects.findIndex(proj => proj.id === project.id) > -1) {
      return prev
    }
    return {
      ...prev,
      openedProjects: [
        ...prev.openedProjects.filter(x => x.id !== project.id),
        project,
      ],
    }
  })
}
export function removeOpenedProject(id: string) {
  let nextSelectedId: string | undefined
  localStore.update(prev => {
    const idx = prev.openedProjects.findIndex(proj => proj.id === id)
    const nextState = [...prev.openedProjects.filter(x => x.id !== id)]
    nextSelectedId = nextState[idx]?.id
    return {
      ...prev,
      openedProjects: nextState,
      selectedProjectId: nextSelectedId,
    }
  })
  return nextSelectedId
}

export function setSelectedProject(id?: string) {
  localStore.update((prev: LocalStore) => {
    prev.selectedProjectId = id
    return prev
  })
}

export default localStore
