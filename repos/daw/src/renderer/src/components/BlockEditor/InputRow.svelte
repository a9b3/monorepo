<script lang="ts">
  import { onMount } from 'svelte'
  import type { Text as TextBlock } from '@renderer/src/app/types/block'
  import Popover from '@renderer/src/components/generic/Popover.svelte'
  import BlockSelection from './BlockSelection.svelte'

  export let placeholder = `Press '/' to create a block...`
  export let path: string
  export let block: TextBlock
  export let onChange: (path: string, value: any) => void

  let textBuffer = block.properties.text

  let containerEl: HTMLDivElement
  let showPopover = false

  onMount(() => {
    if (block.properties.text === '') {
      containerEl.focus()
    }
  })
</script>

<div
  bind:this={containerEl}
  class="main"
  contenteditable={true}
  {placeholder}
  on:input={(e) => {
    if (e.target.innerHTML === '/') {
      showPopover = true
    } else {
      showPopover = false
    }
    onChange(path + '.properties.text', e.target.innerHTML)
  }}
>
  {@html textBuffer}
</div>

<Popover position="bottom" isOpen={showPopover} triggerElement={containerEl} align="left">
  <BlockSelection
    onSelection={(type, properties) => {
      onChange(path + '.type', type)
      onChange(path + '.properties', properties)
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
  .main:empty:before:focus-within {
    content: attr(placeholder);
    pointer-events: none;
    display: block; /* For Firefox */
    color: var(--colors-fg3);
  }
</style>
