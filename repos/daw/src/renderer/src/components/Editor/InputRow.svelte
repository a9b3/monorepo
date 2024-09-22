<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import shortcutManager from '@renderer/src/stores/shortcutManager'
  import Popover from '@renderer/src/components/generic/Popover.svelte'
  import BlockSelection from './BlockSelection.svelte'

  export let placeholder = `Press '/' to create a block...`
  let value = ''
  let containerEl: HTMLDivElement
  let showPopover = false
</script>

<div
  bind:this={containerEl}
  class="main"
  contenteditable={true}
  {placeholder}
  on:input={(e) => {
    if (e.target.textContent === '/') {
      showPopover = true
    } else {
      showPopover = false
    }
    value = e.target.textContent
  }}
>
  {value}
</div>

<Popover position="bottom" isOpen={showPopover} triggerElement={containerEl} align="left">
  <BlockSelection />
</Popover>

<style>
  .main {
    height: 1rem;
    width: 100%;
  }
  .main:focus {
    outline: none;
  }
  .main:empty:before {
    content: attr(placeholder);
    pointer-events: none;
    display: block; /* For Firefox */
    color: var(--colors-fg3);
  }
</style>
