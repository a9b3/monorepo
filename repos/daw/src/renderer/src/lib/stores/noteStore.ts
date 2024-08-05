import { writable } from 'svelte/store'
import type {
  Note,
  UpsertNoteArgs,
  SearchNotesArgs,
  DeleteNoteArgs,
  GetNoteArgs,
  ApiMethods
} from '@ipc/notes'

function createNoteStore() {
  const { subscribe, update, set } = writable<Note[]>([])

  const api: ApiMethods = {
    upsertNote: async (args: UpsertNoteArgs): Promise<UpsertNoteArgs> => {
      const result = await window.api.note.upsertNote(args)
      update((notes) => {
        const index = notes.findIndex((note) => note.id === result.id)
        if (index !== -1) {
          notes[index] = result as Note
        } else {
          notes.push(result as Note)
        }
        return notes
      })
      return result
    },

    searchNotes: async (args: SearchNotesArgs): Promise<UpsertNoteArgs[]> => {
      const results = await window.api.note.searchNotes(args)
      console.log(`searchNotes: ${JSON.stringify(results, ' ', 2)}`)
      set(results as Note[])
      return results
    },

    deleteNote: async (args: DeleteNoteArgs): Promise<void> => {
      await window.api.note.deleteNote(args)
      update((notes) => notes.filter((note) => note.id !== args.id))
    },

    getNote: async (args: GetNoteArgs): Promise<Note> => {
      const result = await window.api.note.getNote(args)
      return result
    }
  }

  return {
    subscribe,
    ...api
  }
}

export const noteStore = createNoteStore()
