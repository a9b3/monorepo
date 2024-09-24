<script lang="ts">
  import type { Block } from '@renderer/src/app/types/block'
  import BlockSwitch from './Blocks/BlockSwitch.svelte'

  export let pageBlock: Block
  export let onChange: (path: string, value: any) => void
</script>

<div class="main">
  {#each pageBlock.children as childBlock, idx}
    {#key childBlock.id}
      <BlockSwitch path={`children.${idx}`} block={childBlock} {onChange} />
    {/key}
  {/each}
</div>

<style>
  .main {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: var(--spacing-s) var(--spacing-xs);
    overflow: auto;
  }
</style>
