import type { Project } from 'daw/core/ui/Project'
import { DBFactory } from './DBFactory'

export type ProjectDoc = Omit<
  ConstructorParameters<typeof Project>[0],
  'audioContext'
> & { id?: string }

export const projectDB = new DBFactory<ProjectDoc>()
