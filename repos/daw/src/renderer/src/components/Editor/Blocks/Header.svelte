<script lang="ts">
  import type { Header } from '@renderer/src/app/types/block'

  export let registerBlock: (node: HTMLElement, id: string) => void
  export let block: Header

  let textBuffer = block.properties.text
</script>

<svelte:element
  this={`h${block.properties.level}`}
  class="main"
  contenteditable
  use:registerBlock={block.id}
>
  {@html textBuffer}
</svelte:element>

<style>
  .main:focus {
    outline: none;
  }
  h1 {
    font-size: var(--font-size-h1);
    padding: var(--spacing-xs) 0;
  }
  h2 {
    font-size: var(--font-size-h2);
    padding: var(--spacing-xs) 0;
  }
  h3 {
    font-size: var(--font-size-h3);
    padding: var(--spacing-xs) 0;
  }
  h4 {
    font-size: var(--font-size-h4);
    padding: var(--spacing-xs) 0;
  }
  h5 {
    font-size: var(--font-size-h5);
    padding: var(--spacing-xs) 0;
  }
  h6 {
    font-size: var(--font-size-h6);
    padding: var(--spacing-xs) 0;
  }
</style>
