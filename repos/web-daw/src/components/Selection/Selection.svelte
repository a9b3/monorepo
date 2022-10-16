<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import type { SelectionManager } from 'src/ui'

  export let container: HTMLElement
  export let selectionManager: SelectionManager

  let sbox: HTMLElement

  onMount(() => {
    selectionManager.registerContainer(container)
    selectionManager.setSelectionBox(sbox)
  })
  onDestroy(() => {
    selectionManager.unregisterContainer()
  })
</script>

<div bind:this={sbox} class={'main'} />

<style>
  .main {
    background: hsl(
      var(--hsl__accent-h),
      var(--hsl__accent-s),
      var(--hsl__accent-l),
      0.2
    );
    border: 1px solid
      hsl(var(--hsl__accent-h), var(--hsl__accent-s), var(--hsl__accent-l), 1);
  }
</style>
