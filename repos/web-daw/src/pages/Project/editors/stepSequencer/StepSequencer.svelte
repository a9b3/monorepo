<script lang="ts">
  import { objectStyle } from 'src/utils/objectToStyleStr'
  import type { Clip } from 'src/daw/Clip'
  import { NOTES } from 'src/daw/instruments/constants'

  export let clip: Clip

  let rows = Array(8).fill(Array(16).fill({}))
  let style = objectStyle({
    gridTemplateColumns: `repeat(${16}, 1fr)`,
    gridTemplateRows: `repeat(${8}, 1fr)`,
  })

  function isInOddBar(quarterNote: number) {
    return [1, 2, 3, 4, 9, 10, 11, 12].includes(quarterNote)
  }

  function getNote(row: number, col: number) {
    const note = Object.keys(NOTES)[row]
    const frequency = NOTES[note][4]
    const startTick = col * $clip.ticksPerBeat
    return $clip.notes[startTick] && $clip.notes[startTick][frequency]
  }

  function toggleNote(row: number, col: number) {
    const note = Object.keys(NOTES)[row]
    const frequency = NOTES[note][4]
    const startTick = col * $clip.ticksPerBeat
    if (getNote(row, col)) {
      $clip.removeNote({ startTick, type: 'on', note, frequency })
    } else {
      $clip.addNote({ startTick, type: 'on', note, frequency })
    }
  }
</script>

<div class={($$restProps.class || '') + ' main'} style={$$restProps.style}>
  <div class="sequencer" {style}>
    {#each rows as row, rowIdx}
      {#each row as col, idx}
        <div
          class="cell"
          class:odd={isInOddBar(idx + 1)}
          class:active={$clip && getNote(rowIdx, idx)}
          on:click={() => toggleNote(rowIdx, idx)}
        />
      {/each}
    {/each}
  </div>
</div>

<style>
  .main {
    background: var(--colors__bg);
    width: 100%;
    padding: var(--spacing__padding);
  }

  .sequencer {
    display: grid;
    width: 100%;
    justify-content: space-between;
    height: 100%;
  }
  .cell {
    width: 25px;
    height: 25px;
    outline: 1px solid var(--colors__fg2);
    border-radius: 4px;
    margin: 5px;
    background: var(--colors__bg3);
  }
  .odd {
    background: none;
  }
  .active {
    background: var(--colors__accent);
  }
</style>
