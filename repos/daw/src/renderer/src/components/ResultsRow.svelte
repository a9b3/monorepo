<script lang="ts">
  import { onMount, onDestroy } from 'svelte'

  // -------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------
  export let result: any

  // -------------------------------------------------------------------------
  // Internal
  // -------------------------------------------------------------------------

  onMount(() => {})
  onDestroy(() => {})
</script>

<div class="main">
  <div>
    {result.title}
  </div>
  <div>
    {result.body.substring(0, 50)}
  </div>
</div>

<style>
  .main {
    display: grid;
    grid-template-columns: 1fr 3fr;
    width: 100%;
    padding: 0 calc(var(--spacing-s) * 1px);
  }
</style>
