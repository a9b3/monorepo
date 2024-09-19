<script lang="ts">
  import { onMount } from 'svelte'
  import { getCursorRange, setCursorRange } from './cursorPos'
  import type { Note, UpsertNoteArgs } from '@ipc/notes'
  import { parse } from './parser'

  export let selectedNote: Note
  export let textBoxRef: HTMLDivElement
  export let onChange: (args: UpsertNoteArgs) => void

  let editContent = ''

  function handleInput(event) {
    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    const start = range.startOffset

    editorContent = event.target.innerText

    // Reapply the cursor position after updating the content
    const newRange = document.createRange()
    newRange.setStart(editor.childNodes[0], start)
    newRange.collapse(true)
    selection.removeAllRanges()
    selection.addRange(newRange)
  }

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
    on:input={() => {
      editContent = textBoxRef.innerHTML
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
  >
    {@html parse(editContent)}
  </div>
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
    color: var(--colors-fg);
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
