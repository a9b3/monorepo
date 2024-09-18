<script lang="ts">
  import Searchbar from './Searchbar.svelte'
  import TextBox from './TextBox.svelte'
  import { noteStore } from '@renderer/src/stores/noteStore'
  import type { Note } from '@ipc/notes'

  let textBoxRef: HTMLDivElement
  let prevSelectedNoteId: string = ''
  let selectedNote: Note

  $: {
    if ($noteStore.selectedNoteId !== prevSelectedNoteId) {
      prevSelectedNoteId = $noteStore.selectedNoteId
      selectedNote = $noteStore.notes.find((note) => note.id === prevSelectedNoteId)
    }
  }
</script>

<Searchbar
  onSubmit={() => {
    if (textBoxRef) {
      textBoxRef.focus()
    }
  }}
/>
{#key $noteStore.selectedNoteId}
  <TextBox
    bind:textBoxRef
    {selectedNote}
    onChange={(note) => {
      noteStore.upsertNote(note)
    }}
  />
{/key}

<style>
</style>
