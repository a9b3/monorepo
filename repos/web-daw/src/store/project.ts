import { writable, derived } from 'svelte/store'
// import projectDb from 'src/database/project'
import { projectDb } from 'src/db'
import type { ProjectDoc } from 'src/db'
import editorStore from './editor'
import dashboardStore from './dashboard'

export const projects = writable<{
  isFetching: boolean
  projects: Map<string, ProjectDoc>
}>({
  isFetching: false,
  projects: new Map(),
})

const projectStore = writable<{ projects: { [key: string]: ProjectDoc } }>({
  projects: {},
})

export async function createProject(project: ProjectDoc) {
  const res = await projectDb.create(project)
  projectStore.update(prev => {
    prev.projects[res.id] = res
    return prev
  })
  return res
}

export async function fetchProjects() {
  const { results } = await projectDb.get()
  projectStore.set({
    projects: results.reduce(
      (m: { [key: string]: ProjectDoc }, res: ProjectDoc) => {
        m[res.id] = res
        return m
      },
      {}
    ),
  })
}

export async function fetchProject(id: string) {
  const result = await projectDb.getById(id)
  projectStore.update(prev => {
    prev.projects[id] = result
    return prev
  })
}

export async function deleteProject(id: string) {
  await projectDb.remove(id)
  projectStore.update(prev => {
    delete prev.projects[id]
    prev.projects = {
      ...prev.projects,
    }
    return prev
  })
}

export const filteredProjects = derived(
  [projectStore, dashboardStore],
  ([$projectStore, $dashboardStore]) => {
    if ($dashboardStore.sortBy === 'lastModified') {
      return Object.values($projectStore.projects).sort((a, b) =>
        a.lastModified < b.lastModified ? 1 : -1
      )
    }
    if ($dashboardStore.sortBy === 'alphabetical') {
      return Object.values($projectStore.projects).sort((a, b) =>
        a.name < b.name ? 1 : -1
      )
    }
  }
)

export const currentlySelectedProject = derived(
  [projectStore, editorStore],
  ([$projectStore, $editorStore]) => {
    const id = $editorStore.selectedProjectId
    return $projectStore.projects[id]
  }
)

export default projectStore
