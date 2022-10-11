import { writable, derived, get } from 'svelte/store'
import { Project } from 'daw/core/ui'
import { projectDb } from 'src/db'
import { audioContext } from 'daw/audioContext'

/**
 * Store all fetched project docs.
 */
export const projects = writable<
  Map<string, ConstructorParameters<typeof Project>[0]>
>(new Map())

export async function fetchProjects() {
  const res = await projectDb.get()
  projects.set(new Map(res.results.map(doc => [doc.id, doc])))
}

/**
 * Store instantiated Projects.
 */
export const openedProjects = writable<Project[]>([])

/**
 * Should always focus a newly opened project.
 *
 * Would there be a use case for opening a project but not focusing it right
 * away?
 */
export function addOpenedProject(id: string) {
  openedProjects.update(prev => {
    const projectDoc = get(projects)[id]
    if (!projectDoc) {
      throw new Error(`'${id}' does not exists`)
    }

    // Already opened, early return
    if (prev.findIndex(p => p.id === projectDoc.id) > -1) {
      return prev
    }

    // Push into openedProjects
    const project = new Project({ ...projectDoc, audioContext })
    prev.push(project)
    return prev
  })
}
