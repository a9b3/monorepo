import { writable, derived } from 'svelte/store'
import type { ProjectT } from 'src/database/project'
import projectDb from 'src/database/project'

const projectStore = writable<{ projects: { [key: string]: ProjectT } }>({
  projects: {},
})

export async function createProject(project: ProjectT) {
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
      (m: { [key: string]: ProjectT }, res: ProjectT) => {
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
    a.createdAt < b.createdAt ? 1 : -1
  )
)

export default projectStore
