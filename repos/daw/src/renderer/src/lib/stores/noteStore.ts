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
  const { subscribe, update } = writable<{
    notes: Note[]
    selectedNoteId: string | null
    selectedNote: Note | null
  }>({
    notes: [],
    selectedNoteId: null,
    selectedNote: null
  })

  const api: ApiMethods & { setSelectedNoteId: (id: string | null) => void } = {
    upsertNote: async (args: UpsertNoteArgs): Promise<UpsertNoteArgs> => {
      const result = await window.api.note.upsertNote(args)
      update((state) => {
        const index = state.notes.findIndex((note) => note.id === result.id)
        if (index !== -1) {
          state.notes[index] = result as Note
        } else {
          state.notes.push(result as Note)
        }
        return state
      })
      return result
    },

    searchNotes: async (args: SearchNotesArgs): Promise<UpsertNoteArgs[]> => {
      const results = await window.api.note.searchNotes(args)
      update((state) => ({ ...state, notes: results as Note[] }))
      return results
    },

    deleteNote: async (args: DeleteNoteArgs): Promise<void> => {
      await window.api.note.deleteNote(args)
      update((state) => ({
        ...state,
        notes: state.notes.filter((note) => note.id !== args.id),
        selectedNoteId: state.selectedNoteId === args.id ? null : state.selectedNoteId
      }))
    },

    getNote: async (args: GetNoteArgs): Promise<Note> => {
      const result = await window.api.note.getNote(args)
      return result
    },

    setSelectedNoteId: (id: string | null) => {
      update((state) => ({
        ...state,
        selectedNoteId: id,
        selectedNote: state.notes.find((note) => note.id === id)
      }))
    }
  }

  return {
    subscribe,
    ...api
  }
}

export const noteStore = createNoteStore()
