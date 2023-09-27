<!--
  @component

  Load theme css variables into the app.
-->
<script lang="ts">
  import { loadPrimatives } from '@monorepo/web-core/styles'

  const renderedStyle = loadPrimatives()
</script>

<svelte:head>
  {@html renderedStyle}
</svelte:head>

<style></style>
