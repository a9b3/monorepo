<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { primatives } from '@monorepo/web-core/styles'

  // -------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------
  export let header: ?number
  export let

  // -------------------------------------------------------------------------
  // Internal
  // -------------------------------------------------------------------------

  onMount(() => {})
  onDestroy(() => {})
</script>

{#if }
<div class="main">
  <slot />
</div>

<style>
  .main {
  }
</style>
