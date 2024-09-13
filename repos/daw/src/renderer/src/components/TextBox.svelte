<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { noteStore } from '@renderer/src/stores/noteStore'
  import type { Note } from '@ipc/notes'

  let selectedNote: Note
  let body = ''

  noteStore.subscribe((value) => {
    selectedNote = value.selectedNote
  })

  $: selectedNote && (body = selectedNote.body || '')
</script>

{#if selectedNote}
  <textarea class="main" bind:value={$noteStore.selectedNote.body} />
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
</style>
