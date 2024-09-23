<!--
  This component is responsible for rendering the editor container.
-->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import type { Block, Page } from '@renderer/src/app/types/block'
  import Searchbar from './Searchbar/Searchbar.svelte'
  import PageBlock from './BlockEditor/RootPage.svelte'
  import blockUtils from './BlockEditor/util'
  import blockEditorStore from './BlockEditor/blockEditor.store'

  let selectedBlock: Block
  let isFocused = false

  onMount(() => {
    $blockEditorStore.editor.registerListeners()
  })
  onDestroy(() => {
    $blockEditorStore.editor.removeListeners()
  })
</script>

<Searchbar
  onBlockChange={(block) => {
    $blockEditorStore.editor.setSelectedPage(block)
  }}
  onSubmit={() => {
    isFocused = true
  }}
/>
{#key $blockEditorStore.editor.selectedPage?.id + $blockEditorStore.editor.selectedPage?.children.length}
  {#if $blockEditorStore.editor.selectedPage}
    <PageBlock
      pageBlock={$blockEditorStore.editor.selectedPage}
      onChange={(path, value) => {
        blockUtils.deepUpdateBlock(path, value, $blockEditorStore.editor.selectedPage)
        $blockEditorStore.editor.setSelectedPage($blockEditorStore.editor.selectedPage)
      }}
      onBlockFocus={(block) => {
        $blockEditorStore.editor.setCurrentlyInFocusBlock(block)
      }}
    />
  {:else}
    <div class="empty">No note selected...</div>
  {/if}
{/key}

<style>
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
