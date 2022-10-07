import { writable, derived } from 'svelte/store'
import type { ProjectDoc } from 'src/database/project'
import projectDb from 'src/database/project'
import editorStore from './editor'

const projectStore = writable<{ projects: { [key: string]: ProjectDoc } }>({
  projects: {},
})

export async function createProject(project: ProjectDoc) {
  const res = await projectDb.create(project)
  projectStore.update(prev => {
    prev.projects[res.id] = res
    return prev
  })
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

export const filteredProjects = derived([projectStore], ([$projectStore]) =>
  Object.values($projectStore.projects).sort((a, b) =>
    a.lastModified < b.lastModified ? 1 : -1
  )
)

export const currentlySelectedProject = derived(
  [projectStore, editorStore],
  ([$projectStore, $editorStore]) => {
    const id = $editorStore.selectedProjectId
    return $projectStore.projects[id]
  }
)

export default projectStore
