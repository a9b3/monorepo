<script lang="ts">
  import { onMount } from 'svelte'
  import type { Block } from '@renderer/src/app/types/block'
  import BlockSwitch from './Blocks/BlockSwitch.svelte'

  export let pageBlock: Block
  export let onChange: (path: string, value: any) => void

  function lastBlockIsEmptyText(pageBlock: Block) {
    const lastBlock = pageBlock.children[pageBlock.children.length - 1]
    if (!lastBlock) return false
    return lastBlock.type === 'text' && lastBlock.properties.text === ''
  }
</script>

<div class="main">
  {#each pageBlock.children as childBlock, idx}
    {#key childBlock.id}
      <BlockSwitch path={`children.${idx}`} block={childBlock} {onChange} />
    {/key}
  {/each}

  <!-- Allow clicking to craete new empty text block -->
  {#if pageBlock && !lastBlockIsEmptyText(pageBlock)}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="bottom"
      on:click={() => {
        onChange('children', [
          ...pageBlock.children,
          {
            type: 'text',
            properties: {
              text: ''
            },
            children: []
          }
        ])
      }}
    ></div>
  {/if}
</div>

<style>
  .main {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: var(--spacing-s) var(--spacing-xs);
    overflow: auto;
  }
  .bottom {
    height: 100%;
  }
</style>
