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
  <div class="id">
    {result.id}
  </div>
  <div class="title">
    {result.title}
  </div>
  <div class="body">
    {result.body}
  </div>
</div>

<style>
  .main {
    display: grid;
    grid-template-columns: 1fr 1fr 3fr;
    width: 100%;
    padding: 0 calc(var(--spacing-s) * 1px);
    grid-gap: calc(var(--spacing-s) * 1px);
  }

  .title {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .body {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>
