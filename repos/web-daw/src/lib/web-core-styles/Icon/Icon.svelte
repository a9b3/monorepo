<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { svgData, primatives } from '@monorepo/web-core/styles'

  // -------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------
  export let type: keyof typeof svgData['stroke'] = 'folder'
  // 'currentColor' will always match the parent elements css 'color' attr
  export let color: keyof typeof primatives.color | 'currentColor' =
    'currentColor'

  // -------------------------------------------------------------------------
  // Internal
  // -------------------------------------------------------------------------

  $: dValue = svgData.stroke[type].d
  $: isFill = svgData.stroke[type].isFill
  $: isStroke = svgData.stroke[type].isStroke
  $: colorValue = color === 'currentColor' ? 'currentColor' : `var(--${color})`

  onMount(() => {})
  onDestroy(() => {})
</script>

<div>
  <svg width={`1em`} height={`1em`} viewBox="0 0 15 15" fill="none">
    <path
      d={dValue}
      stroke={isStroke ? colorValue : null}
      fill={isFill ? colorValue : null}
    />
  </svg>
</div>
