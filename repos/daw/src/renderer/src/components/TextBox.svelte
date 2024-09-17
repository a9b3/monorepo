<script lang="ts">
  import { noteStore } from '@renderer/src/stores/noteStore'
  import type { Note } from '@ipc/notes'
  import { parse } from './parser'

  let editContent = ''
  let selectedNote: Note
  let body = ''

  noteStore.subscribe((value) => {
    selectedNote = value.notes.find((note) => note.id === value.selectedNoteId)
  })

  $: selectedNote && (body = selectedNote.body || '')
  $: {
    console.log(parse(body))
  }
</script>

{#if selectedNote}
  <div class="main" bind:innerHTML={selectedNote.body} contenteditable />
{:else}
  <div class="empty">No note selected...</div>
{/if}

<style>
  .main {
    height: 100%;
    width: 100%;
    background: var(--colors-bg);
    padding: 0 var(--spacing-xs);
    border: none;
    font-family: var(--font-family);
    line-height: var(--base-line-height);
    font-size: var(--base-font-size);
    color: var(--colors-fg2);
    resize: none;
  }

  .main:focus {
    outline: none;
    /* box-shadow: inset 0 0 0 2px var(--colors-fg2); */
  }

  .empty {
    display: flex;
    justify-content: center;
    height: 100%;
    width: 100%;
    font-size: var(--spacing-m);
    color: var(--colors-fg3);
    padding-top: var(--spacing-s);
  }
</style>
