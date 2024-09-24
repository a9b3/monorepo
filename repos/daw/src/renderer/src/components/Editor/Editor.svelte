<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import Block from './Blocks/Block.svelte'
  import editorStore from '@renderer/src/stores/editor'

  onMount(() => {
    $editorStore.editor.registerListeners()
  })
  onDestroy(() => {
    $editorStore.editor.removeListeners()
  })
</script>

<div class="main">
  {#each $editorStore.editor.currentFocusPage.children as childBlock}
    {#key childBlock.id + childBlock.type}
      <Block block={childBlock} />
    {/key}
  {/each}
</div>

<style>
  .main {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: var(--spacing-s) var(--spacing-xs);
    overflow: auto;
  }
</style>
