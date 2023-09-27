<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { svgData } from '@monorepo/web-core/styles'

  // -------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------
  export let type: keyof typeof svgData['stroke'] = 'folder'
  export let size: number = 15
  export let color: string = 'var(--primatives_colors_brand_purple)'

  // -------------------------------------------------------------------------
  // Internal
  // -------------------------------------------------------------------------

  const dValue = svgData.stroke[type]

  onMount(() => {})
  onDestroy(() => {})
</script>

<svg width={`${size}px`} height={`${size}px`} viewBox="0 0 15 15" fill="none">
  <path d={dValue} stroke={color} />
</svg>
