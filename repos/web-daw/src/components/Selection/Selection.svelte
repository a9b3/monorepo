<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import type { ModKeys, SelectionManager } from 'src/ui'

  export let container: HTMLElement
  export let selectionManager: SelectionManager
  export let modKey: ModKeys
  export let onMove: any
  export let snapRow: number = undefined
  export let snapColumn: number = undefined
  export let onMoveFinish

  let sbox: HTMLElement

  $: {
    selectionManager.setModKey(modKey)
  }

  onMount(() => {
    selectionManager.registerContainer(container, { modKey })
    selectionManager.setSelectionBox(sbox)
    if (snapRow) {
      selectionManager.snapRow = snapRow
    }
    if (snapColumn) {
      selectionManager.snapColumn = snapColumn
    }
    if (onMove) {
      selectionManager.setOnMove(onMove)
    }
    selectionManager.setOnMoveFinish(onMoveFinish)
  })
  onDestroy(() => {
    selectionManager.unregisterContainer()
    if (onMove) {
      selectionManager.removeOnMove()
    }
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
