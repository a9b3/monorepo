<script lang="ts">
  import { onMount, onDestroy } from 'svelte'

  // -------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------

  export let results: any = []

  // -------------------------------------------------------------------------
  // Internal
  // -------------------------------------------------------------------------

  onMount(() => {})
  onDestroy(() => {})
</script>

<div class="main">
  {JSON.stringify(results)}
</div>

<style>
  .main {
    background: var(--semantic-colors-background1);
  }
</style>
