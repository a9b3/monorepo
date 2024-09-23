<!--
  This component is responsible for rendering the editor container.
-->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import Searchbar from './Searchbar/Searchbar.svelte'
  import PageBlock from './BlockEditor/RootPage.svelte'
  import blockUtils from './BlockEditor/util'
  import blockEditorStore from './BlockEditor/blockEditor.store'

  let isFocused = false

  onMount(() => {
    $blockEditorStore.editor.registerListeners()
  })
  onDestroy(() => {
    $blockEditorStore.editor.removeListeners()
  })
</script>

<div class="container">
  <Searchbar
    onPageChange={(page) => {
      $blockEditorStore.editor.setCurrentFocusPage(page)
    }}
    onSubmit={() => {
      isFocused = true
    }}
  />
  <div class="editor">
    {#key $blockEditorStore.editor.currentFocusPage?.id}
      {#if $blockEditorStore.editor.currentFocusPage}
        <PageBlock
          pageBlock={$blockEditorStore.editor.currentFocusPage}
          onChange={(path, value) => {
            blockUtils.deepUpdateBlock(path, value, $blockEditorStore.editor.currentFocusPage)
            $blockEditorStore.editor.setCurrentFocusPage($blockEditorStore.editor.currentFocusPage)
          }}
        />
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
