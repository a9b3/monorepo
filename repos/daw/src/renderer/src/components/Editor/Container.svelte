<script lang="ts">
  import type { Block } from '@renderer/src/app/types/block'
  import InputRow from './InputRow.svelte'

  export let block: Block
  let containerEl: HTMLDivElement
</script>

{#if block}
  <div bind:this={containerEl} class="main" on:focusin={() => console.log('focusin')}>
    <InputRow />
  </div>
{:else}
  <div class="empty">No note selected...</div>
{/if}

<style>
  .main {
    height: 100%;
    width: 100%;
    background: var(--colors-bg);
    padding: var(--spacing-xs) var(--spacing-xs);
    border: none;
    font-family: var(--font-family);
    line-height: var(--base-line-height);
    font-size: var(--base-font-size);
    color: var(--colors-fg);
  }

  .empty {
    display: flex;
    justify-content: center;
    height: 100%;
    width: 100%;
    font-size: var(--spacing-m);
    color: var(--colors-fg3);
    padding-top: var(--spacing-s);
  }
</style>
