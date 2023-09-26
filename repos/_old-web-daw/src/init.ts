import PouchDB from 'pouchdb'
/* eslint-disable */
import PouchDbFind from 'pouchdb-find'
PouchDB.plugin(PouchDbFind)
import { audioContext } from 'daw/audioContext'
import { editorDB, projectDB, userDB } from 'src/db'
import { DANGEROUSLY_RESET_EVERYTHING } from './utils/debug'
/* eslint-enable */

/**
 * Run code that is outside of the UI applciation here. This will run in main.ts
 * before loading the frontend application.
 */
export async function init() {
  // @ts-expect-error Hack for now
  await AWPF.polyfill(audioContext, [])

  await Promise.all([
    await editorDB.init('editor'),
    await projectDB.init('project'),
    await userDB.init('user'),
  ])

  if (!localStorage.getItem('resetted')) {
    if (window.location.host === 'lllllllll.link') {
      await DANGEROUSLY_RESET_EVERYTHING()
      localStorage.setItem('resetted', 'true')
    }
  }
}
