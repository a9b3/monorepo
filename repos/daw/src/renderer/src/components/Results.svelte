<script lang="ts">
  import { onMount, onDestroy } from 'svelte'

  const results = [{ id: 1, title: 'Result 1' }]

  // -------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------

  // -------------------------------------------------------------------------
  // Internal
  // -------------------------------------------------------------------------

  onMount(() => {})
  onDestroy(() => {})
</script>

<div class="main"></div>

<style>
  .main {
    background: var(--semantic-colors-background1);
  }
</style>
