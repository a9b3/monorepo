<script lang="ts">
  import Text from 'src/components/Text.svelte'
  import { objectStyle } from 'src/utils/objectToStyleStr'

  export let label: string
</script>

<div class={($$restProps.class || '') + ' main'} style={$$restProps.style}>
  <Text style={objectStyle({ padding: 'var(--spacing__paddingM)' })}
    >{label}</Text
  >
  <div>
    <slot />
  </div>
</div>

<style>
  .main {
  }
</style>
