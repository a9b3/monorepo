<script lang="ts">
  import { onMount } from 'svelte'
  import type { Header } from '@renderer/src/app/types/block'
  import { autofocus } from './autofocus'
  export let block: Header
  export let path: string
  export let onChange = (path: string, value: string) => {}

  let textBuffer = block.properties.text
  let containerEl: HTMLDivElement

  function handleOnChange(e) {
    onChange(path, e.target.innerHTML)
  }
</script>

<svelte:element
  this={`h${block.properties.level}`}
  class="main"
  contenteditable
  on:input={handleOnChange}
  bind:this={containerEl}
  data-block-id={block.id}
  use:autofocus
>
  {@html textBuffer}
</svelte:element>

<style>
  .main:focus {
    outline: none;
  }
  h1 {
    font-size: var(--font-size-h1);
    line-height: var(--font-size-h1);
  }
  h2 {
    font-size: var(--font-size-h2);
    line-height: var(--font-size-h2);
  }
  h3 {
    font-size: var(--font-size-h3);
    line-height: var(--font-size-h3);
  }
  h4 {
    font-size: var(--font-size-h4);
    line-height: var(--font-size-h4);
  }
  h5 {
    font-size: var(--font-size-h5);
    line-height: var(--font-size-h5);
  }
  h6 {
    font-size: var(--font-size-h6);
    line-height: var(--font-size-h6);
  }
</style>
