import type { Project } from 'daw/core/ui/Project'
import { dbFactory } from './factory'
import type { DBManagedFields } from './factory'

export const userDb = dbFactory('user')

/**
 * Schema of the editor document in the database.
 */
export interface EditorDoc {
  id?: string
  openedProjects: Project[]
  selectedProjectId: string | undefined
  inFocusElement: string | undefined
  inFocusTrack: string | undefined
  user?: string
}

export const editorDb = (() => {
  const factory = dbFactory<EditorDoc>('editor')

  return {
    ...factory,
    /**
     * Lazy create settings for user.
     */
    getByUserId: async (
      userId: string
    ): Promise<EditorDoc & DBManagedFields> => {
      const { docs } = await factory.getDb().find({
        selector: {
          user: userId,
        },
      })
      if (!docs[0]) {
        const created = await factory.create({
          openedProjects: [],
          selectedProjectId: undefined,
          inFocusElement: undefined,
          inFocusTrack: undefined,
          user: userId,
        })
        return created
      }
      return docs[0]
    },
  }
})()

export type ProjectDoc = Omit<
  ConstructorParameters<typeof Project>[0],
  'audioContext'
> & { id?: string }
export const projectDb = dbFactory<ProjectDoc>('project')
