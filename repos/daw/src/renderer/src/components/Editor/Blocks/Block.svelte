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
  import Url from './Url.svelte'
  import Icon from '@renderer/src/components/generic/Icon.svelte'

  export let registerBlock: (node: HTMLElement, id: string) => void
  export let block: Block

  const component = {
    header: Header,
    text: Text,
    code: Code,
    listItem: ListItem,
    url: Url,
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
    padding-right: var(--spacing-xxs);
    transition: opacity 0.2s ease;
    cursor: move;
  }
  .container {
    padding: 0 var(--spacing-s);
    position: relative;
    outline: none;
  }
  .container:hover .icons {
    visibility: visible;
    opacity: 1;
  }
  .container:has(.icons:hover) {
    outline: 1px dashed black;
    outline-offset: -1px;
  }
</style>
