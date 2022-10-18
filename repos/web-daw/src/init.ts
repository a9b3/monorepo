// Run before anything else.
// import PouchDB from 'pouchdb/dist/pouchdb.js'
import PouchDB from 'pouchdb'
import { audioContext } from 'daw/audioContext'
import PouchDbFind from 'pouchdb-find'
PouchDB.plugin(PouchDbFind)

export async function init() {
  await AWPF.polyfill(audioContext, [])
  try {
    // TODO REMOVE, super hack until database stablizes
    if (window.location.host === 'lllllllll.link"') {
      await new Promise(resolve => {
        setTimeout(resolve, 1000)
      })
    }
  } catch (err) {
    console.error(`err`, err)
  }
}
