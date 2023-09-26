<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import type { ClickSelectionOption } from './clickSelectionType'

  export let options: Readonly<ClickSelectionOption[]> = []
  export let selectedKeys = []
  export let onSelect: (key: ClickSelectionOption) => void

  let showMenu = false

  function onmousedown() {
    showMenu = false
  }
  onMount(() => {
    window.addEventListener('mousedown', onmousedown)
  })
  onDestroy(() => {
    window.removeEventListener('mousedown', onmousedown)
  })
</script>

<div class="parent" on:click={() => (showMenu = !showMenu)}>
  {#if showMenu}
    <div class="child">
      {#each options as option}
        <div
          class="option"
          class:selected={selectedKeys.includes(option.key)}
          on:mousedown={() => {
            onSelect(option)
          }}
        >
          {option.label}
        </div>
      {/each}
    </div>
  {/if}

  <slot />
</div>

<style>
  .parent {
    position: relative;
  }

  .child {
    border-radius: 4px;
    position: absolute;
    top: 0;
    left: 50%;
    background: var(--colors__bottom);
    transform: translate(-50%, 20px);
    z-index: 1000;
    max-height: 500px;
    overflow: auto;
  }

  .option {
    padding: 10px 20px;
    width: 120px;
  }
  .option:hover {
    filter: brightness(0.8);
  }
</style>
