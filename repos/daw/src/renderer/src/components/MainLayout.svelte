<!--
  This component is responsible for rendering the editor container.
-->
<script lang="ts">
  import editorStore from '@renderer/src/stores/editor'
  import Searchbar from './Searchbar/Searchbar.svelte'
  import Editor from './Editor/Editor.svelte'
</script>

<div class="container">
  <Searchbar
    onPageChange={(page) => {
      $editorStore.editor.setCurrentFocusPage(page)
    }}
    onSubmit={() => {}}
  />
  <div class="editor">
    {#key $editorStore.editor.page?.id}
      {#if $editorStore.editor.page}
        <Editor />
      {:else}
        <div class="empty">No note selected...</div>
      {/if}
    {/key}
  </div>
</div>

<style>
  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .editor {
    height: 100%;
    flex: 1;
    overflow: auto;
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
