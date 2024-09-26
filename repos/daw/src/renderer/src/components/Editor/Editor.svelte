<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import editorStore, { editor } from '@renderer/src/stores/editor'
  import { shortcutManager } from '@renderer/src/stores/shortcutManager'
  import { onEditorCreate, onEditorDestroy } from '@renderer/src/app/lib/Editor'
  import { onMouseDown, onMouseMove, onMouseUp } from '@renderer/src/app/lib/ui/textSelection'
  import Block from './Blocks/Block.svelte'

  onMount(() => {
    onEditorCreate({ shortcutManager, editor })
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  })
  onDestroy(() => {
    onEditorDestroy({ shortcutManager })
    document.removeEventListener('mousedown', onMouseDown)
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  })
</script>

<div class="main">
  <div class="wrapper">
    {#each $editorStore.editor.page.children as childBlock}
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
    user-select: none;
  }
  .main:focus-within {
    box-shadow: inset 0 0 0 2px var(--colors-hl);
  }

  .wrapper {
    max-width: 40rem;
    width: 100%;
  }
</style>
