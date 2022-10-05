<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { objectStyle } from 'src/utils/objectToStyleStr'
  import type { Clip } from 'src/daw/Clip'
  import { NOTES } from 'src/daw/instruments/constants'
  import { currentProject } from 'src/store/editor'

  export let clip: Clip
  export let clipIsActive: boolean
  let notesPerBeat = 4

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
    const startTick = col * ($clip.ticksPerBeat / notesPerBeat)
    return $clip.notes[startTick] && $clip.notes[startTick][frequency]
  }

  function toggleNote(row: number, col: number) {
    const note = Object.keys(NOTES)[row]
    const frequency = NOTES[note][4]
    const startTick = col * ($clip.ticksPerBeat / notesPerBeat)
    if (getNote(row, col)) {
      $clip.removeNote({ startTick, frequency })
    } else {
      $clip.addNote({ startTick, type: 'on', note, frequency })
    }
  }

  let elapsedCounter: number
  function handlePlay() {}
  function handleTick(args) {
    const currentBeat =
      Math.floor(args.currentTick / (args.ticksPerBeat / notesPerBeat)) %
      (4 * 4)
    if (currentBeat !== elapsedCounter) {
      elapsedCounter = currentBeat
    }
  }
  function handleStop() {
    elapsedCounter = 0
  }
  onMount(() => {
    $currentProject.controller.on('play', handlePlay)
    $currentProject.controller.on('tick', handleTick)
    $currentProject.controller.on('stop', handleStop)
  })
  onDestroy(() => {
    $currentProject.controller.removeListener('play', handlePlay)
    $currentProject.controller.removeListener('tick', handleTick)
    $currentProject.controller.removeListener('stop', handleStop)
  })
</script>

<div class={($$restProps.class || '') + ' main'} style={$$restProps.style}>
  <div class="sequencer" {style}>
    {#each rows as row, rowIdx}
      {#each row as col, idx}
        <div
          class="cell"
          class:clipIsActive
          class:playing={elapsedCounter === idx}
          class:odd={isInOddBar(idx + 1)}
          class:active={$clip && getNote(rowIdx, idx)}
          on:mousedown={() => toggleNote(rowIdx, idx)}
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
  .cell:hover {
    filter: brightness(0.8);
  }
  .odd {
    background: none;
  }
  .active {
    background: var(--colors__fg2);
    animation: ease-out();
  }
  .cell.playing {
    outline: 1px solid var(--colors__bg2);
  }
  .cell.playing.active.clipIsActive {
    background: var(--colors__neonPink);
  }
</style>
