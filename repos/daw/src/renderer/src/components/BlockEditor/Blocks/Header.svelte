<script lang="ts">
  import { onMount } from 'svelte'
  import type { Header } from '@renderer/src/app/types/block'
  export let block: Header
  export let path: string
  export let onChange = (path: string, value: string) => {}

  let textBuffer = block.properties.text
  let containerEl: HTMLDivElement

  function handleOnChange(e) {
    onChange(path, e.target.innerHTML)
  }

  onMount(() => {
    if (block.properties.text === '') {
      containerEl.focus()
    }
  })
</script>

{#if block.properties.level === 1}
  <h1 class="main" contenteditable on:input={handleOnChange} bind:this={containerEl}>
    {@html textBuffer}
  </h1>
{:else if block.properties.level === 2}
  <h2 class="main" contenteditable on:input={handleOnChange} bind:this={containerEl}>
    {@html textBuffer}
  </h2>
{:else if block.properties.level === 3}
  <h3 class="main" contenteditable on:input={handleOnChange} bind:this={containerEl}>
    {@html textBuffer}
  </h3>
{:else if block.properties.level === 4}
  <h4 class="main" contenteditable on:input={handleOnChange} bind:this={containerEl}>
    {@html textBuffer}
  </h4>
{:else if block.properties.level === 5}
  <h5 class="main" contenteditable on:input={handleOnChange} bind:this={containerEl}>
    {@html textBuffer}
  </h5>
{:else if block.properties.level === 6}
  <h6 class="main" contenteditable on:input={handleOnChange} bind:this={containerEl}>
    {@html textBuffer}
  </h6>
{/if}

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
