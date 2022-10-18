import { writable, derived } from 'svelte/store'

import { projectDB } from 'src/db'
import type { ProjectDoc } from 'src/db'

import { editorStore } from './editor'
import { dashboardStore } from './dashboard'

// ***********************************
// Store
// ***********************************

/**
 * Store fetching state
 */
export const projectFetching = writable(false)

/**
 * Store fetched projects
 */
export const projectStore = writable<{
  projects: { [key: string]: ProjectDoc }
}>({
  projects: {},
})

export const resetProjectStore = () => {
  projectStore.set({
    projects: {},
  })
}

// ***********************************
// Actions
// ***********************************

export async function createProject(
  project: Parameters<typeof projectDB.create>[0]
): ReturnType<typeof projectDB.create> {
  const res = await projectDB.create(project)
  projectStore.update(prev => {
    prev.projects[res.id] = res
    return prev
  })
  return res
}

export async function fetchProjects() {
  projectFetching.set(true)

  const { results } = await projectDB.get()
  projectStore.set({
    projects: Object.fromEntries(results.map(doc => [doc.id, doc])),
  })

  projectFetching.set(false)

  return results
}

export async function fetchProject(id: string) {
  const result = await projectDB.getById(id)

  projectStore.update(prev => {
    prev.projects[id] = result
    return prev
  })

  return result
}

export async function deleteProject(id: string) {
  await projectDB.remove(id)

  projectStore.update(prev => {
    delete prev.projects[id]
    return prev
  })
}

// ***********************************
// Derived
// ***********************************

export const filteredProjects = derived(
  [projectStore, dashboardStore],
  ([$projectStore, $dashboardStore]): ProjectDoc[] => {
    switch ($dashboardStore.sortBy) {
      case 'lastModified':
        return Object.values($projectStore.projects).sort((a, b) =>
          a.lastModified < b.lastModified ? 1 : -1
        )
      case 'alphabetical':
        return Object.values($projectStore.projects).sort((a, b) =>
          a.name < b.name ? 1 : -1
        )
      default:
        return Object.values($projectStore.projects)
    }
  }
)

export const currentlySelectedProject = derived(
  [projectStore, editorStore],
  ([$projectStore, $editorStore]): ProjectDoc | undefined => {
    return $projectStore.projects[$editorStore.selectedProjectId]
  }
)

export default projectStore
