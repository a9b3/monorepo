<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { objectStyle } from 'src/utils'
  import type { MidiClip, TickHandler } from 'daw/core'
  import { editorStore, currentProject } from 'src/store/editor'

  export let beatsPerLoop: number
  // TODO use this later to handle time signature change
  // export let beatsPerBar = 4
  // Sequencer's division. ex. 4 would mean 1/16, 16 notes per bar.
  export let beatDivision: number = 4
  export let numNotes: number = 8
  export let ticksPerBeat: number
  export let clip: MidiClip
  export let clipIsActive: boolean

  let rows = Array(numNotes).fill(Array(beatsPerLoop * beatDivision).fill({}))
  let style = objectStyle({
    gridTemplateColumns: `repeat(${beatsPerLoop * beatDivision}, 1fr)`,
    gridTemplateRows: `repeat(${numNotes}, 1fr)`,
  })

  function isOddBeat(cellNumber: number) {
    return cellNumber % (beatDivision * 2) >= beatDivision
  }

  function getNote(row: number, col: number) {
    // Middle C
    const note = 60 + row
    const startTick = col * (ticksPerBeat / beatDivision)
    return $clip.getEvents(startTick, note)
  }

  function toggleNote(row: number, col: number) {
    // Middle C
    const note = 60 + row
    const startTick = col * (ticksPerBeat / beatDivision)
    const foundNotes = getNote(row, col)
    if (foundNotes) {
      foundNotes.forEach(n => $clip.remove(n.id))
    } else {
      // TODO add a noteOff event too
      $clip.insert({ note, type: 'noteOn', velocity: 67, startTick })
    }
  }

  let elapsedCounter: number
  const handleTick: TickHandler = args => {
    const currentBeat =
      Math.floor(args.currentTick / (args.ticksPerBeat / beatDivision)) %
      (4 * beatsPerLoop)
    if (currentBeat !== elapsedCounter) {
      elapsedCounter = currentBeat
    }
  }
  function handleStop() {
    elapsedCounter = 0
  }

  onMount(() => {
    const curProj = $editorStore.openedProjects.find(
      proj => proj.id === $editorStore.selectedProjectId
    )

    curProj.controller.on('tick', handleTick)
    curProj.controller.on('stop', handleStop)
  })
  onDestroy(() => {
    if ($currentProject) {
      $currentProject.controller.removeListener('tick', handleTick)
      $currentProject.controller.removeListener('stop', handleStop)
    }
  })
</script>

<div class={'main'}>
  <div class="sequencer" {style}>
    {#each rows as row, rowIdx}
      {#each row as _, idx}
        <div
          class="cell"
          class:clipIsActive
          class:playing={elapsedCounter === idx}
          class:odd={isOddBeat(idx)}
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
    padding: var(--spacing__padding);
    width: 100%;
  }

  .sequencer {
    display: grid;
    width: 100%;
    justify-content: space-between;
    height: 100%;
  }
  .cell {
    width: 20px;
    height: 25px;
    outline: 1px solid var(--colors__fg2);
    border-radius: 4px;
    margin: 3px;
    background: var(--colors__bg3);
    transition: all 0.1s ease;
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
