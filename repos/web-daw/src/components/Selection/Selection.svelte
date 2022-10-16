<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import type { ModKeys, SelectionManager } from 'src/ui'

  export let container: HTMLElement
  export let selectionManager: SelectionManager
  export let modKey: ModKeys

  let sbox: HTMLElement

  $: {
    selectionManager.setModKey(modKey)
  }

  onMount(() => {
    selectionManager.registerContainer(container, { modKey })
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
  }
</style>
