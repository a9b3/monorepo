import { writable } from 'svelte/store'
import type { ProjectT } from 'src/database/project'
import type { EditorT } from 'src/database/editor'
import editorDb from 'src/database/editor'
import { Project } from 'src/daw/Project'

const editorStore = writable<EditorT>({
  id: '',
  openedProjects: [],
  selectedProjectId: undefined,
  inFocusElement: undefined,
  user: undefined,
})

export async function fetchEditor(id: string) {
  const editor = await editorDb.getByUserId(id)
  editorStore.set({
    ...editor,
    openedProjects: editor.openedProjects.map(proj => new Project(proj)),
  })
}

export function addOpenedProject(project: Project) {
  editorStore.update(prev => {
    if (prev.openedProjects.findIndex(proj => proj.id === project.id) > -1) {
      return prev
    }
    const nextState = {
      ...prev,
      openedProjects: [
        ...prev.openedProjects.filter(x => x.id !== project.id),
        new Project(project),
      ],
    }

    // TODO sync database strat
    editorDb.update(prev.id, nextState)

    return nextState
  })
}
export function removeOpenedProject(id: string) {
  let nextSelectedId: string | undefined
  editorStore.update(prev => {
    nextSelectedId = prev.selectedProjectId

    if (id !== prev.selectedProjectId) {
      const nextProf = [...prev.openedProjects.filter(x => x.id !== id)]
      if (nextProf.length === 0) {
        nextSelectedId = undefined
      }
      const nextState = {
        ...prev,
        openedProjects: nextProf,
        selectedProjectId: nextSelectedId,
      }
      // TODO sync database strat
      editorDb.update(prev.id, nextState)
      return nextState
    }

    const idx = prev.openedProjects.findIndex(proj => proj.id === id)
    const nextProf = [...prev.openedProjects.filter(x => x.id !== id)]
    nextSelectedId = nextProf[idx]?.id
    const nextState = {
      ...prev,
      openedProjects: nextProf,
      selectedProjectId: nextSelectedId,
    }
    // TODO sync database strat
    editorDb.update(prev.id, nextState)
    return nextState
  })
  return nextSelectedId
}

export function setSelectedProject(id?: string) {
  editorStore.update((prev: EditorT) => {
    prev.selectedProjectId = id

    // TODO sync database strat
    editorDb.update(prev.id, prev)

    return prev
  })
}

export function setInFocusElement(id?: string) {
  editorStore.update((prev: EditorT) => {
    prev.inFocusElement = id

    // TODO sync database strat
    editorDb.update(prev.id, prev)

    return prev
  })
}

export default editorStore
