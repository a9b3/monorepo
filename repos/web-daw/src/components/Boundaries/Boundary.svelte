<!--
  @component

  Adds the Boundary attrs to the immediate parent.
  Extend this for different types of Boundaries (e.g. KeyboardEventBoundary,
  ContextMenuBoundary etc.).
-->
<script lang="ts">
  import { getContext, onMount, onDestroy } from 'svelte'
  import type { BoundaryManager } from 'src/ui/boundary/manager'

  export let rootKey: string
  export let key: string
  export let boundaryEl: HTMLElement = undefined

  const boundaryManager: BoundaryManager = getContext(rootKey)
  if (!boundaryManager) {
    throw new Error('Boundary must be a descendent of BoundaryApp')
  }

  onMount(() => {
    boundaryEl.parentElement.setAttribute(boundaryManager.rootAttr, rootKey)
    boundaryEl.parentElement.setAttribute(boundaryManager.keyAttr, key)
    boundaryManager.addBoundary(key)
  })
  onDestroy(() => {
    boundaryEl.parentElement.removeAttribute(boundaryManager.rootAttr)
    boundaryEl.parentElement.removeAttribute(boundaryManager.keyAttr)
    boundaryManager.deleteBoundary(key)
  })
</script>

<div class="boundary" bind:this={boundaryEl} />

<style>
  .boundary {
    visibility: none;
  }
</style>
