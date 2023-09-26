import { editorDB, projectDB, userDB } from 'src/db'
import {
  resetEditorStore,
  resetProjectStore,
  resetDashboardStore,
} from 'src/store'

export async function DANGEROUSLY_RESET_EVERYTHING() {
  resetEditorStore()
  resetProjectStore()
  resetDashboardStore()

  await Promise.all([
    await editorDB.DANGEROUSLY_RESET(),
    await projectDB.DANGEROUSLY_RESET(),
    await userDB.DANGEROUSLY_RESET(),
  ])
}
