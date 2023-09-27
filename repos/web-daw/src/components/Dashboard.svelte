<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import Finder from './Finder.svelte'

  // -------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------

  // -------------------------------------------------------------------------
  // Internal
  // -------------------------------------------------------------------------

  onMount(() => {})
  onDestroy(() => {})
</script>

<div class="main">
  <div class="finder">
    <Finder />
  </div>
  <div class="content" />
</div>

<style>
  .main {
    display: grid;
    grid-template: 'finder content' 1fr / auto 1fr;
  }
  .finder {
    grid-area: finder;
  }
  .content {
    grid-area: content;
  }
</style>
