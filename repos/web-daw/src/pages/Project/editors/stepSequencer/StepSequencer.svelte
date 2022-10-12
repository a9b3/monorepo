<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { objectStyle } from 'src/utils'
  import type { MidiClip } from 'daw/core/midi'
  import { currentProject } from 'src/store/editor'

  export let ticksPerBeat: number
  export let clip: MidiClip
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
    // Middle C
    const note = 60 + row
    const startTick = col * (ticksPerBeat / notesPerBeat)
    return Object.values($clip.eventsMap[startTick]?.[note] || {}).find(
      midiEvent => midiEvent.type === 'noteOn'
    )
  }

  function toggleNote(row: number, col: number) {
    // Middle C
    const note = 60 + row
    const startTick = col * (ticksPerBeat / notesPerBeat)
    const midiEvent = getNote(row, col)
    if (midiEvent) {
      $clip.removeEvent(startTick, String(note), midiEvent.id)
    } else {
      $clip.addEvent(startTick, { note, type: 'noteOn', velocity: 67 })
    }
  }

  let elapsedCounter: number
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
    $currentProject.controller.on('tick', handleTick)
    $currentProject.controller.on('stop', handleStop)
  })
  onDestroy(() => {
    if ($currentProject) {
      $currentProject.controller.removeListener('tick', handleTick)
      $currentProject.controller.removeListener('stop', handleStop)
    }
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
