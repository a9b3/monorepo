<script lang="ts">
  import { onMount, onDestroy } from 'svelte'

  // -------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------
  export let isBold: boolean = false
  export let isSubtitle: boolean = false
  export let header: 0 | 1 | 2 | 3 = 0

  // -------------------------------------------------------------------------
  // Internal
  // -------------------------------------------------------------------------

  onMount(() => {})
  onDestroy(() => {})
</script>

{#if header}
  {#if header === 1}
    <h1 class:bold={isBold}><slot /></h1>
  {/if}
  {#if header === 2}
    <h2 class:bold={isBold}><slot /></h2>
  {/if}
  {#if header === 3}
    <h3 class:bold={isBold}><slot /></h3>
  {/if}
{/if}

{#if !header}
  <span class:bold={isBold} class:subtitle={isSubtitle}><slot /></span>
{/if}

<style>
  .bold {
    font-weight: 600;
  }

  h1 {
    font-size: var(--pv_spacing_4);
  }
  h2 {
    font-size: var(--pv_spacing_3);
  }
  h3 {
    font-size: var(--pv_spacing_2);
  }

  .subtitle {
    color: var(--pv_colors_grey_400);
  }
</style>
