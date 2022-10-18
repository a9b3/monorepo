<script lang="ts">
  import type { Track, Instrument } from 'daw/core'
  import { Player, Window } from 'src/components'
  import { createDragTarget } from 'src/components/draggable'
  import { DX7 as DX7Component } from 'src/components/Instruments/DX7'

  export let instrumentType: string
  export let instrument: Instrument = undefined
  export let addInstrument: Track['addInstrument']

  let showWindow = false

  const dragDirective = createDragTarget(dragTarget => {
    if (dragTarget.type === 'instrument') {
      addInstrument(dragTarget.metadata.instrumentType)
    }
  })
</script>

{#if showWindow}
  {#if instrumentType === 'DX7'}
    <Window
      title={`${instrumentType}`}
      onClose={() => {
        showWindow = false
      }}
    >
      <DX7Component dx7={instrument} />
    </Window>
  {/if}
{/if}
<div
  class="main"
  class:active={instrument}
  class:empty={!instrument}
  use:dragDirective
  on:click={() => {
    if (instrument) {
      showWindow = !showWindow
    }
  }}
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
    border: 1px dashed
      hsla(var(--hsl__fg2-h), var(--hsl__fg2-s), var(--hsl__fg2-l), 0.3);
    border-radius: 4px;
  }

  .active {
    border: unset;
  }

  .empty {
    color: hsla(var(--hsl__fg2-h), var(--hsl__fg2-s), var(--hsl__fg2-l), 0.3);
  }

  .player {
    width: 100%;
    height: 100%;
  }
</style>
