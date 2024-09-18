<script lang="ts">
  import { onMount } from 'svelte'
  import { noteStore } from '@renderer/src/stores/noteStore'
  import type { Note } from '@ipc/notes'
  import { parse } from './parser'
  import {
    saveCursorPosition,
    restoreCursorPosition,
    rememberCursorPos,
    getCursorPos
  } from './cursorPos'

  export let textBoxRef: HTMLDivElement
  let prevId = ''
  let prevContent = ''
  let editContent = ''
  let selectedNote: Note

  $: {
    if ($noteStore.selectedNoteId !== prevId) {
      prevId = $noteStore.selectedNoteId
      selectedNote = $noteStore.notes.find((note) => note.id === prevId)
      editContent = selectedNote?.body || ''
    }

    if (editContent !== prevContent && editContent !== selectedNote?.body) {
      prevContent = editContent
      if (selectedNote) {
        noteStore.upsertNote({
          title: selectedNote.title,
          id: selectedNote.id,
          body: editContent
        })
      }
    }
  }
</script>

{#if selectedNote}
  <div
    class="main"
    bind:this={textBoxRef}
    bind:innerHTML={editContent}
    on:blur={() => {
      rememberCursorPos(selectedNote.id, saveCursorPosition(textBoxRef))
    }}
    on:focus={() => {
      restoreCursorPosition(textBoxRef, getCursorPos(selectedNote.id))
    }}
    contenteditable
  />
{:else}
  <div class="empty">No note selected...</div>
{/if}

<style>
  .main {
    height: 100%;
    width: 100%;
    background: var(--colors-bg);
    padding: var(--spacing-xs) var(--spacing-xs);
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
