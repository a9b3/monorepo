<script lang="ts">
  import type { SoundSource } from 'daw/core'
  import { createDragTarget } from '../draggable'

  export let handleUrl: Parameters<typeof createDragTarget>[0]
  export let sample: SoundSource

  const useDrop = createDragTarget(handleUrl)
</script>

<div class={'main'} class:empty={!sample} use:useDrop>
  {sample ? sample.name : 'Drop Sample Here'}
</div>

<style>
  .main {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;
    padding: 5px;
  }
  .empty {
    color: var(--colors__fg2);
    justify-content: center;
    border: unset;
  }
</style>
