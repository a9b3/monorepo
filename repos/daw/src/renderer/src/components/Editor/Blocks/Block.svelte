<!--
Svelte block component that renders a block based on its type.

Also houses block manipulation logic such as drag and drop, resizing, etc.
-->
<script lang="ts">
  import type { Block } from '@renderer/src/app/types/block'
  import editorStore from '@renderer/src/stores/editor'
  import Text from './Text.svelte'
  import Header from './Header.svelte'
  import Code from './Code.svelte'
  import ListItem from './ListItem.svelte'

  export let block: Block

  const component = {
    header: Header,
    text: Text,
    code: Code,
    listItem: ListItem
  }[block.type]
</script>

<div class="container" class:selected={$editorStore.editor.selectedBlocks.has(block.id)}>
  <svelte:component this={component} {block} />
</div>

<style>
  .selected {
    background: rgba(0, 0, 0, 0.4);
  }
  .container {
    padding: 0;
  }
  .container:hover {
    outline: 1px solid rgba(0, 0, 0, 0.08);
  }
</style>
