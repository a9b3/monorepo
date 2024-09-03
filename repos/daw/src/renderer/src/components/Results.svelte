<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import ResultsRow from './ResultsRow.svelte'

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
  {#each results as item}
    <ResultsRow result={item} />
  {/each}
</div>

<style>
  .main {
    background: var(--semantic-colors-background1);
    display: flex;
    flex-direction: column;
    width: 100%;
  }
</style>
