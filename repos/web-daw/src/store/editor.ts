import { writable, derived } from 'svelte/store'
import type { EditorDoc } from 'src/database/editor'
import type { ProjectDoc } from 'src/database/project'
// import editorDb from 'src/database/editor'
import { Project } from 'src/daw/Project'
import { editorDb } from 'src/db'

const editorStore = writable<EditorDoc>({
  id: '',
  openedProjects: [],
  selectedProjectId: undefined,
  inFocusElement: undefined,
  inFocusTrack: undefined,
  user: undefined,
})

export async function fetchEditor(id: string) {
  const editor = await editorDb.getByUserId(id)
  editorStore.set({
    ...editor,
    openedProjects: editor.openedProjects.map(proj => new Project(proj)),
  })
}

/**
 * Should always focus a newly opened project.
 *
 * Would there be a use case for opening a project but not focusing it right
 * away?
 */
export function addOpenedProject(project: ProjectDoc) {
  editorStore.update(prev => {
    if (prev.openedProjects.findIndex(proj => proj.id === project.id) > -1) {
      return prev
    }
    const nextState = {
      ...prev,
      selectedProjectId: project.id,
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

/**
 * Implements the default tab behavior of most tabbed applications. If deleting
 * the selected item automatically focus the next item. If no more next item
 * focus the previous item.
 */
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

/**
 * Reference to the currently selected project id.
 */
export function setSelectedProject(id?: string) {
  editorStore.update((prev: EditorDoc) => {
    prev.selectedProjectId = id

    // TODO sync database strat
    editorDb.update(prev.id, prev)

    return prev
  })
}

/**
 * Anything can be an in focus element just pass an id. Useful for when you just
 * wanna keep track of something being in focus or not.
 *
 * TODO Need a system to store selected elements once this app gets to the point
 * of selecting multiple elements to bulk edit or move around.
 * Maybe it should be an array with a shape like this {type: 'clip' | 'track', id: string}
 */
export function setInFocusElement(id?: string) {
  editorStore.update((prev: EditorDoc) => {
    prev.inFocusElement = id

    // TODO sync database strat
    editorDb.update(prev.id, prev)

    return prev
  })
}

/**
 * We wanna display selected clip and selected track so store selected track in
 * another reference.
 */
export function setInFocusTrack(id?: string) {
  editorStore.update((prev: EditorDoc) => {
    prev.inFocusTrack = id

    // TODO sync database strat
    editorDb.update(prev.id, prev)

    return prev
  })
}

/**
 * Returns the current project. Use this in the project view.
 */
export const currentProject = derived([editorStore], ([$editorStore]) => {
  return $editorStore.openedProjects.find(
    proj => proj.id === $editorStore.selectedProjectId
  )
})

export default editorStore
