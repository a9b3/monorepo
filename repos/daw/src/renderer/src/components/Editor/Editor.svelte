<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import editorStore, { editor } from '@renderer/src/stores/editor'
  import { shortcutManager } from '@renderer/src/stores/shortcutManager'
  import { onEditorCreate, onEditorDestroy } from '@renderer/src/app/lib/Editor'
  import Block from './Blocks/Block.svelte'

  onMount(() => {
    onEditorCreate({ shortcutManager, editor })
  })
  onDestroy(() => {
    onEditorDestroy({ shortcutManager })
  })
</script>

<div class="main">
  <div class="wrapper">
    {#each $editorStore.editor.currentFocusPage.children as childBlock}
      {#key childBlock.id + childBlock.type}
        <Block block={childBlock} />
      {/key}
    {/each}
  </div>
</div>

<style>
  .main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--spacing-s) var(--spacing-xs);
    overflow: auto;
  }
  .main:focus-within {
    box-shadow: inset 0 0 0 2px var(--colors-hl);
  }

  .wrapper {
    max-width: 40rem;
    width: 100%;
  }
</style>
