<!--
Svelte block component that renders a block based on its type.

Also houses block manipulation logic such as drag and drop, resizing, etc.
-->
<script lang="ts">
  import type { Block } from '@renderer/src/app/types/block'
  import Text from './Text.svelte'
  import Header from './Header.svelte'
  import Code from './Code.svelte'
  import ListItem from './ListItem.svelte'
  import Icon from '@renderer/src/components/generic/Icon.svelte'

  export let registerBlock: (node: HTMLElement, id: string) => void
  export let block: Block

  const component = {
    header: Header,
    text: Text,
    code: Code,
    listItem: ListItem
  }[block.type]
</script>

<div class="container">
  <div class="icons"><Icon icon="move" size="var(--spacing-xs)" color="var(--colors-fg2)" /></div>
  <svelte:component this={component} {block} {registerBlock} />
</div>

<style>
  .icons {
    position: absolute;
    visibility: hidden;
    opacity: 0;
    transform: translate(-100%, -50%);
    top: 50%;
    padding-right: var(--spacing-xs);
    transition: opacity 0.4s ease-in-out;
  }
  .container {
    padding: 0;
    position: relative;
  }
  .container:hover .icons {
    visibility: visible;
    opacity: 1;
  }
  /* When container height is greater than 100px, position icons at top */
  @container (min-height: 100px) {
    .icons {
      top: 0;
      transform: translate(-100%, 0);
    }
  }
</style>
