<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { BoundaryApp } from 'src/components'
  import { contextMenuStore } from 'src/store'

  onMount(() => {})
  onDestroy(() => {})
</script>

<BoundaryApp boundaryManager={contextMenuStore.boundaryManager}>
  <slot />
</BoundaryApp>
