import { writable } from 'svelte/store'
import type { Note, UpsertNoteArgs, SearchNotesArgs, DeleteNoteArgs, GetNoteArgs } from '@ipc/notes'

const { subscribe, update } = writable<{
  notes: Note[]
  selectedNoteId: string | null
}>({
  notes: [],
  selectedNoteId: null
})

const upsertNote = (() => {
  let fetching = false

  return async (args: UpsertNoteArgs): Promise<Note> => {
    if (fetching) {
      return {} as Note
    }
    fetching = true
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
    fetching = false
    return result
  }
})()

const searchNotes = async (args: SearchNotesArgs): Promise<Note[]> => {
  const results = await window.api.note.searchNotes(args)
  update((state) => ({
    ...state,
    notes: results as Note[],
    selectedNoteId: null
  }))
  return results
}

const deleteNote = async (args: DeleteNoteArgs): Promise<void> => {
  await window.api.note.deleteNote(args)
  update((state) => ({
    ...state,
    notes: state.notes.filter((note) => note.id !== args.id),
    selectedNoteId: state.selectedNoteId === args.id ? null : state.selectedNoteId
  }))
}

const getNote = async (args: GetNoteArgs): Promise<Note> => {
  const result = await window.api.note.getNote(args)
  return result
}

const setSelectedNoteId = (id: string | null) => {
  update((state) => ({
    ...state,
    selectedNoteId: id
  }))
}

const nextNote = () => {
  update((state) => {
    const index = state.notes.findIndex((note) => note.id === state.selectedNoteId)
    if (index === -1) {
      if (state.notes.length > 0) {
        return {
          ...state,
          selectedNoteId: state.notes[0].id
        }
      }
      return state
    }
    const nextIndex = index + 1
    if (nextIndex >= state.notes.length) {
      return state
    }
    const nextNote = state.notes[nextIndex]
    return {
      ...state,
      selectedNoteId: nextNote.id
    }
  })
}

const prevNote = () => {
  update((state) => {
    const index = state.notes.findIndex((note) => note.id === state.selectedNoteId)
    if (index === -1) {
      if (state.notes.length > 0) {
        return {
          ...state,
          selectedNoteId: state.notes[0].id
        }
      }
      return state
    }
    const prevIndex = index - 1
    if (prevIndex < 0) {
      return state
    }
    const prevNote = state.notes[prevIndex]
    return {
      ...state,
      selectedNoteId: prevNote.id
    }
  })
}

export const noteStore = {
  subscribe,
  upsertNote,
  searchNotes,
  deleteNote,
  getNote,
  setSelectedNoteId,
  nextNote,
  prevNote
}
