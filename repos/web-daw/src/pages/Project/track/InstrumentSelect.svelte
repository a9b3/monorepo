<script lang="ts">
  import type { Track, Instrument } from 'daw/core'
  import { Player } from 'src/components'
  import { createDragTarget } from 'src/components/draggable'

  export let instrumentType: string
  export let instrument: Instrument = undefined
  export let addInstrument: Track['addInstrument']

  const dragDirective = createDragTarget(dragTarget => {
    if (dragTarget.type === 'instrument') {
      addInstrument(dragTarget.metadata.instrumentType)
    }
  })
</script>

<div
  class="main"
  class:active={instrument}
  class:empty={!instrument}
  use:dragDirective
>
  {#if !instrument}
    Drag instrument here
  {/if}
  {#if instrument}
    <div class="player">
      <Player {instrumentType} />
    </div>
  {/if}
</div>

<style>
  .main {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px dashed var(--colors__fg2);
    border-radius: 4px;
  }

  .active {
    border: unset;
  }

  .empty {
    color: var(--colors__fg2);
  }

  .player {
    width: 100%;
    height: 100%;
  }
</style>
