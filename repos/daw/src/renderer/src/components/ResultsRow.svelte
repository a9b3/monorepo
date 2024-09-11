<script lang="ts">
  export let result: any
  import { noteStore } from '@renderer/src/stores/noteStore'
  import type { Note } from '@ipc/notes'

  let selectedNote: Note
  noteStore.subscribe((value) => {
    selectedNote = value.selectedNote
  })

  function handleClick() {
    noteStore.setSelectedNoteId(result.id)
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="main"
  on:click={handleClick}
  class:active={selectedNote && selectedNote.id === result.id}
>
  <div class="title">
    {result.title}
  </div>
  <div class="body">
    {result.body}
  </div>
  <div class="lastModified">
    {result.lastModified}
  </div>
</div>

<style>
  .main {
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    width: 100%;
    padding: 0 calc(var(--spacing-s) * 1px);
    grid-gap: calc(var(--spacing-s) * 1px);
  }

  .title {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .body {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .lastModified {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .active {
    background: var(--semantic-colors-surface2);
    color: var(--semantic-colors-background1);
  }
</style>
