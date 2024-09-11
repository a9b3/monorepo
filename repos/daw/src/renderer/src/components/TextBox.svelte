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

<textarea class="main" bind:value={body} />

<style>
  .main {
    background: var(--semantic-colors-background1);
    cursor: text;
    padding: calc(var(--spacing-s) * 1px);
    border: none;
    font-family: var(--semantic-font-family);
    font-size: 1rem;
    color: var(--semantic-colors-surface2);
    resize: none;
  }

  .main:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px var(--semantic-colors-surface2);
  }
</style>
