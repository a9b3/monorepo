<!--
  @component
-->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import type { ClickSelectionOption } from './clickSelectionType'

  export let options: Readonly<ClickSelectionOption[]> = []
  export let selectedKeys = []
  export let onSelect: (key: ClickSelectionOption) => void

  let showMenu = false
  let mainEl: HTMLElement

  function onmousedown() {
    showMenu = false
  }

  function parentclick() {
    showMenu = !showMenu
  }

  onMount(() => {
    console.log(mainEl.parentElement)
    if (getComputedStyle(mainEl.parentElement).position !== 'relative') {
      throw new Error(
        'must attach click selection as a child of a relative parent'
      )
    }
    mainEl.parentElement.addEventListener('click', parentclick)
    window.addEventListener('mousedown', onmousedown)
  })
  onDestroy(() => {
    mainEl.parentElement.removeEventListener('click', parentclick)
    window.removeEventListener('mousedown', onmousedown)
  })
</script>

<div class="child" class:showMenu bind:this={mainEl}>
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

<style>
  .child.showMenu {
    visibility: visible;
  }

  .child {
    visibility: hidden;
    border-radius: 4px;
    position: absolute;
    top: 50%;
    left: 50%;
    background: var(--colors__bottom);
    transform: translate(-50%, 0);
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
