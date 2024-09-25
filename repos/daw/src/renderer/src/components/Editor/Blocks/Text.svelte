<script lang="ts">
  import type { Text as TextBlock } from '@renderer/src/app/types/block'
  import Popover from '@renderer/src/components/generic/Popover.svelte'
  import BlockSelection from './BlockSelection.svelte'
  import editorStore, { setBlockBehavior } from '@renderer/src/stores/editor'

  export let placeholder = `Press '/' to create a block...`
  export let block: TextBlock

  let textBuffer = block.properties.text

  let containerEl: HTMLDivElement
  let showPopover = false
</script>

<div
  bind:this={containerEl}
  class="main"
  contenteditable={true}
  use:setBlockBehavior={block.id}
  {placeholder}
  on:input={(e) => {
    if (e.target.innerHTML === '/') {
      e.target.innerHTML = ''
      showPopover = true
    } else {
      showPopover = false
    }
  }}
>
  {@html textBuffer}
</div>

<Popover position="bottom" bind:isOpen={showPopover} triggerElement={containerEl} align="left">
  <BlockSelection
    onClose={() => (showPopover = false)}
    onSelection={(type, properties) => {
      $editorStore.editor.updateBlock(block.id, {
        ...block,
        type,
        properties
      })
      showPopover = false
    }}
  />
</Popover>

<style>
  .main {
    width: 100%;
  }
  .main:focus {
    outline: none;
  }
  .main:focus:empty:before {
    content: attr(placeholder);
    pointer-events: none;
    display: block; /* For Firefox */
    color: var(--colors-fg3);
  }
</style>
