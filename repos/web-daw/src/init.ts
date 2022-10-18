import PouchDB from 'pouchdb'
/* eslint-disable */
import PouchDbFind from 'pouchdb-find'
PouchDB.plugin(PouchDbFind)
import { audioContext } from 'daw/audioContext'
import { editorDB, projectDB, userDB } from 'src/db'
/* eslint-enable */

/**
 * Run code that is outside of the UI applciation here. This will run in main.ts
 * before loading the frontend application.
 */
export async function init() {
  // @ts-expect-error Hack for now
  await AWPF.polyfill(audioContext, [])

  // await new Promise(resolve => setTimeout(resolve, 2000))

  await Promise.all([
    await editorDB.init('editor'),
    await projectDB.init('project'),
    await userDB.init('user'),
  ])
}
