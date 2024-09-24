<script lang="ts">
  import type { Header } from '@renderer/src/app/types/block'
  import { editorHelper } from './editorHelper'

  export let block: Header

  let textBuffer = block.properties.text
</script>

<svelte:element
  this={`h${block.properties.level}`}
  class="main"
  contenteditable
  data-block-id={block.id}
  use:editorHelper
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
