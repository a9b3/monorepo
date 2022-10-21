<!--
  @component

  Extend this for different types of Boundaries (e.g. KeyboardEventBoundary,
  ContextMenuBoundary etc.).
-->
<script lang="ts">
  import type { BoundaryManager } from 'src/ui/boundary/manager'
  import { onMount, onDestroy, setContext } from 'svelte'

  export let boundaryManager: BoundaryManager

  setContext(boundaryManager.rootKey, boundaryManager)

  onMount(() => {
    boundaryManager.startListener()
  })
  onDestroy(() => {
    boundaryManager.stopListener()
  })
</script>

<slot />
