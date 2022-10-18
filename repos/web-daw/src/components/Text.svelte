<!--
  @component

  General text component.
-->
<script lang="ts">
  import { objectToStyleStr } from 'src/utils/objectToStyleStr'
  import { styles } from 'src/utils/styles'

  export let type: 'label' = 'label'
  export let color: keyof typeof styles.colors = 'fg'
  export let bold: boolean = false

  const types = {
    label: {
      '--color': styles.colors[color],
      color: 'var(--color)',
    },
  }
  const overrideStyles =
    objectToStyleStr({
      ...types[type],
      fontWeight: bold ? 'bold' : 'normal',
    }) + $$restProps.style
</script>

<div class={$$restProps.class || ''} style={overrideStyles}>
  <slot />
</div>

<style>
</style>
