// Run before anything else.
// import PouchDB from 'pouchdb/dist/pouchdb.js'
import PouchDB from 'pouchdb'
import { audioContext } from 'daw/audioContext'
import PouchDbFind from 'pouchdb-find'
PouchDB.plugin(PouchDbFind)

export async function init() {
  await AWPF.polyfill(audioContext, [])
}
