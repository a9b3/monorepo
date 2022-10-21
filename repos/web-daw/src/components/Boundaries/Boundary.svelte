<!--
  @component

  Extend this for different types of Boundaries (e.g. KeyboardEventBoundary,
  ContextMenuBoundary etc.).
-->
<script lang="ts">
  import { getContext, onMount } from 'svelte'
  import type { BoundaryManager } from 'src/ui/boundary/manager'

  export let rootKey: string
  export let key: string
  export let boundaryEl: HTMLElement = undefined

  const boundaryManager: BoundaryManager = getContext(rootKey)
  if (!boundaryManager) {
    throw new Error('Boundary must be a descendent of BoundaryApp')
  }

  onMount(() => {
    // No two boundaries can be siblings.
    for (let i = 0; i < boundaryEl.parentElement.children.length; i += 1) {
      const child = boundaryEl.parentElement.children.item(i)
      if (
        child.getAttribute(boundaryManager.rootAttr) === rootKey &&
        child !== boundaryEl
      ) {
        throw new Error('Boundaries of the same type cannot be siblings.')
      }
    }
    boundaryEl.setAttribute(boundaryManager.rootAttr, rootKey)
    boundaryEl.setAttribute(boundaryManager.keyAttr, key)
  })
</script>

<div class="boundary" bind:this={boundaryEl} />

<style>
  .boundary {
    visibility: none;
  }
</style>
