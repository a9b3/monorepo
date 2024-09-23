<script lang="ts">
  import type { Block } from '@renderer/src/app/types/block'
  import Text from './Text/Text.svelte'
  import Header from './Header.svelte'
  import Code from './Code.svelte'

  export let path: string
  export let block: Block
  export let onChange: (path: string, value: any) => void
</script>

<div class="container">
  {#if block.type === 'header'}
    <Header {block} {onChange} path={path + '.properties.text'} />
  {:else if block.type === 'text'}
    <Text {block} {onChange} {path} />
  {:else if block.type === 'code'}
    <Code
      value={block.properties.text}
      onChange={(value) => {
        onChange(path + '.properties.text', value)
      }}
    />
  {/if}
</div>

{#each block.children as childBlock, idx}
  <svelte:self block={childBlock} path={`${path}.children.${idx}`} />
{/each}

<style>
  .container {
    padding: var(--spacing-xxs) 0;
  }
  .container:hover {
    outline: 1px solid rgba(0, 0, 0, 0.08);
  }
</style>
