<script lang="ts">
  import { onMount } from 'svelte'
  import editorStore from '@renderer/src/stores/editor'
  import Block from './Blocks/Block.svelte'
  import { EditorDom } from './editorDom'

  export let editorDom: EditorDom

  let editorEl: HTMLDivElement

  onMount(() => {
    const teardown = editorDom.onEditorCreate(editorEl)

    return {
      destroy: () => {
        teardown()
      }
    }
  })
</script>

<div class="main" bind:this={editorEl}>
  <div class="wrapper">
    {#each $editorStore.editor.page.children as childBlock}
      {#key childBlock.id + childBlock.type}
        <Block block={childBlock} registerBlock={editorDom.onBlockCreate} />
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
    padding: var(--spacing-s) var(--spacing-l);
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
