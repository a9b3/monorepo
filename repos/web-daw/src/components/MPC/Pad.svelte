<script lang="ts">
  import { createDragTarget } from 'src/components/draggable'
  import type { SoundSource } from 'src/daw/SoundSource'

  export let handleUrl
  export let sample: SoundSource

  const useDrop = createDragTarget(handleUrl)
</script>

<div
  class={($$restProps.class || '') + ' main'}
  style={$$restProps.style}
  use:useDrop
>
  {sample ? sample.name : 'empty'}
</div>

<style>
  .main {
    width: 100%;
    height: 100%;
  }

  .input {
    all: unset;
  }
</style>
