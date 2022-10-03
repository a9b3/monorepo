<script lang="ts">
  import { styles, convertToCss } from 'src/utils/styles'

  const renderedStyle = convertToCss(styles)
</script>

<svelte:head>
  {@html renderedStyle}
</svelte:head>

<style></style>
