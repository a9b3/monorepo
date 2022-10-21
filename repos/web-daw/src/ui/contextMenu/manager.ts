import { BoundaryManager } from '../boundary/manager'

export const BOUNDARY_KEY = 'contextMenu'

export class ContextMenuManager {
  boundaryManager = new BoundaryManager(BOUNDARY_KEY)

  handler: () => {}
}
