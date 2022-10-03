<script lang="ts">
  import { objectToStyleStr } from 'src/utils/objectToStyleStr'
  export let type = 'label'

  const types = {
    label: {
      '--color': 'var(--colors__fg2)',
      color: 'var(--color)',
    },
  }
  const overrideStyles =
    objectToStyleStr({
      ...types[type],
    }) + $$restProps.style
</script>

<div class={$$restProps.class || ''} style={overrideStyles}>
  <slot />
</div>

<style>
</style>
