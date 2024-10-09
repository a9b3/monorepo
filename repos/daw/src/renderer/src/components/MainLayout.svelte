<!--
  This component is responsible for rendering the editor container.
-->
<script lang="ts">
  import editorStore from '@renderer/src/stores/editor'
  import Searchbar from './Searchbar/Searchbar.svelte'
  import Editor from './Editor/Editor.svelte'
  import { EditorDom } from './Editor/editorDom'
  import shortcutManagerStore from '@renderer/src/stores/shortcutManager'

  let editorDom: EditorDom = new EditorDom({
    editor: $editorStore.editor,
    shortcutManager: $shortcutManagerStore.manager
  })
  let editorEl
</script>

<div class="container">
  <Searchbar
    onPageChange={(page) => {
      $editorStore.editor.setPage(page)
      editorDom.focusId = $editorStore.editor.page?.children[0]?.id
    }}
    onSubmit={() => {
      console.log(`editorEl`, editorEl)
    }}
  />
  <div class="editor">
    {#key $editorStore.editor.page?.id}
      {#if $editorStore.editor.page}
        <Editor {editorDom} bind:editorEl />
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
