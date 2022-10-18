import type { Project } from 'daw/core/ui/Project'
import { DBFactory } from './DBFactory'
import type { DBManagedFields } from './DBFactory'

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

class EditorDB extends DBFactory<EditorDoc> {
  /**
   * Lazy create settings for user.
   */
  getByUserId = async (
    userId: string
  ): Promise<EditorDoc & DBManagedFields> => {
    const { docs } = await this.db.find({
      selector: {
        user: userId,
      },
    })
    if (!docs[0]) {
      const created = await this.create({
        openedProjects: [],
        selectedProjectId: undefined,
        inFocusElement: undefined,
        inFocusTrack: undefined,
        user: userId,
      })
      return created
    }
    return docs[0]
  }
}

export const editorDB = new EditorDB()
