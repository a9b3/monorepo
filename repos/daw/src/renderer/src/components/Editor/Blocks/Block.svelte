<!--
Svelte block component that renders a block based on its type.

Also houses block manipulation logic such as drag and drop, resizing, etc.
-->
<script lang="ts">
  import type { Block } from '@renderer/src/app/types/block'
  import Text from './Text.svelte'
  import Header from './Header.svelte'
  import Code from './Code.svelte'

  export let block: Block

  const component = {
    header: Header,
    text: Text,
    code: Code
  }[block.type]
</script>

<div class="container">
  <svelte:component this={component} {block} />
</div>

<style>
  .container {
    padding: var(--spacing-xxs) 0;
  }
  .container:hover {
    outline: 1px solid rgba(0, 0, 0, 0.08);
  }
</style>
