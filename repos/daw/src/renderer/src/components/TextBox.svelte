<script lang="ts">
  import { onMount } from 'svelte'
  import { getCursorRange, setCursorRange, rememberCursorPos, getCursorPos } from './cursorPos'
  import type { Note, UpsertNoteArgs } from '@ipc/notes'

  export let selectedNote: Note
  export let textBoxRef: HTMLDivElement
  export let onChange: (args: UpsertNoteArgs) => void

  let editContent = ''
  onMount(() => {
    if (selectedNote) {
      editContent = selectedNote.body
    }
  })
</script>

{#if selectedNote}
  <div
    class="main"
    bind:this={textBoxRef}
    bind:innerHTML={editContent}
    on:input={() => {
      const cursorRange = getCursorRange(textBoxRef)
      onChange({
        id: selectedNote.id,
        title: selectedNote.title,
        body: editContent,
        cursorStart: cursorRange.start,
        cursorEnd: cursorRange.end
      })
    }}
    on:focus={() => {
      setCursorRange(textBoxRef, { start: selectedNote.cursorStart, end: selectedNote.cursorEnd })
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
