<script lang="ts">
  import { ContextMenuGroup } from 'src/components'

  export let clip
  export let clipIsActive
  export let playing
  export let active
  export let odd
  export let ticksPerBeat
  export let beatDivision
  export let getNote
  export let toggleNote
  export let rowIdx
  export let colIdx
  export let colLength

  function insertNote(row: number, col: number) {
    const note = 60 + row
    const startTick = col * (ticksPerBeat / beatDivision)
    const foundNotes = getNote(row, col)
    if (foundNotes) {
      return
    } else {
      $clip.insert({
        note,
        type: $clip.MidiEventTypes.noteOn,
        velocity: 67,
        startTick,
      })
    }
  }

  function createHandler(division) {
    return () => {
      for (let i = 0; i < colLength; i += 1) {
        if (i % division === 0) {
          insertNote(rowIdx, i)
        }
      }
    }
  }
</script>

<div
  class="cell"
  class:clipIsActive
  class:playing
  class:odd
  class:active
  on:mousedown={evt => {
    if (evt.buttons === 1) {
      toggleNote(rowIdx, colIdx)
    }
  }}
>
  <ContextMenuGroup
    menu={{
      items: [
        {
          label: 'Repeat every 2',
          handler: createHandler(2),
          type: 'item',
        },
        {
          label: 'Repeat every 4',
          handler: createHandler(4),
          type: 'item',
        },
        {
          label: 'Repeat every 2/4',
          handler: () => {
            insertNote(rowIdx, 4)
            insertNote(rowIdx, 12)
            insertNote(rowIdx, 20)
            insertNote(rowIdx, 28)
          },
          type: 'item',
        },
      ],
    }}
  />
</div>

<style>
  .cell {
    width: 20px;
    height: 25px;
    outline: 1px solid var(--colors__fg2);
    border-radius: 4px;
    margin: 3px;
    background: var(--colors__bg3);
    transition: all 0.1s ease;
    position: relative;
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
