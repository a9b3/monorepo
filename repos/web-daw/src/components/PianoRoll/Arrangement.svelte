<!--
  @component

  The arrangement view for the piano roll.
-->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { objectStyle } from 'src/utils'
  import CursorLine from './CursorLine/CursorLine.svelte'
  import type { SelectionManager } from 'src/ui'
  import { ContextMenu } from 'src/components'
  import type { MidiClip, MidiEvent as MidiEventT } from 'daw/core/midi'
  import type { Instrument } from 'daw/core'
  import { hoverKey, setHoverKey, snapEnabled } from './pianoRollStore'
  import MidiEvent from './MidiEvent.svelte'
  import Selection from '../Selection/Selection.svelte'

  export let numberOfKeys: number
  export let keyHeight: number
  export let barWidth: number
  export let numberOfBars: number
  export let ticksPerBeat: number
  export let barDivision: number
  export let onMidi: Instrument['onMidi']
  export let midiClip: MidiClip
  export let selectionManager: SelectionManager

  let container: HTMLElement
  let mouseOverNotes = false

  // Total ticks in current arrangement view
  $: totalTicks = numberOfBars * 4 * ticksPerBeat
  // Datastructure for displaying midi events in this component
  $: transformedMap = $midiClip.getStartIndexForUI()

  function addEvent(
    evt: MouseEvent,
    { note, snapEnabled, ticksPerBeat, totalTicks },
    onAdd: (arg: Pick<MidiEventT, 'note' | 'startTick' | 'endTick'>) => void
  ) {
    const startTick =
      ((evt.target as HTMLElement).offsetLeft /
        ((evt.target as HTMLElement).offsetParent as HTMLElement).offsetWidth) *
      totalTicks
    const endTick =
      startTick +
      ((evt.target as HTMLElement).offsetWidth /
        ((evt.target as HTMLElement).offsetParent as HTMLElement).offsetWidth) *
        totalTicks

    onAdd({ note, startTick, endTick })
  }

  // Initialize the grid
  let rows = Array(numberOfKeys)
    .fill(1)
    .map((_, i) => i)
    .reverse()
  let bars = Array(numberOfBars)
    .fill(1)
    .map((_, i) => i)
  let notesPerBar = Array(barDivision)
    .fill(1)
    .map((_, i) => i)

  function onmouseup() {
    mouseOverNotes = false
  }
  onMount(() => {
    window.addEventListener('mouseup', onmouseup)
  })
  onDestroy(() => {
    window.addEventListener('mouseup', onmouseup)
  })
</script>

<div
  bind:this={container}
  class={'main'}
  style={objectStyle({
    '--keyheight': `${(keyHeight * 7) / 12}px`,
    '--barwidth': `${barWidth}px`,
    '--notewidth': `${barWidth / barDivision}px`,
  })}
>
  {#if container}
    <Selection {selectionManager} {container} modKey={'metaKey'} />
  {/if}
  <CursorLine numberOfBeats={numberOfBars * 4} />
  <ContextMenu />
  <div class="timeline">
    {#each bars as bar}
      <div class="bar" class:offset={bar % 2 === 1}>
        <div class="indicator">
          {bar + 1}
        </div>
      </div>
    {/each}
  </div>
  {#each rows as row}
    <div
      class="row"
      class:offset={row % 2 === 0}
      class:accent={[0, 5].includes(row % 12)}
      class:hover={$hoverKey === row}
      on:focus={() => {}}
      on:mousedown={evt => {
        if (!evt.metaKey) {
          mouseOverNotes = true
          onMidi({ type: 'noteOn', note: row, velocity: 67, endTick: 0.5 })

          addEvent(
            evt,
            { note: row, snapEnabled: $snapEnabled, ticksPerBeat, totalTicks },
            ({ note, startTick, endTick }) => {
              $midiClip.insert({
                type: 'noteOn',
                note,
                velocity: 67,
                startTick: Math.floor(startTick),
                endTick: Math.floor(endTick) - 1,
              })
            }
          )
        }
      }}
      on:mouseover={evt => {
        setHoverKey(row)
        if (!mouseOverNotes) {
          return
        }
        if (evt.buttons) {
          onMidi({ note: row, type: 'noteOn', velocity: 40, endTick: 0.5 })
        }
      }}
    >
      {#if transformedMap[String(row)]}
        {#each transformedMap[String(row)] as midiEvent}
          {#key midiEvent.id}
            <MidiEvent
              {selectionManager}
              {midiEvent}
              {ticksPerBeat}
              numberOfBeats={numberOfBars * 4}
            />
          {/key}
        {/each}
      {/if}
      {#each bars as bar}
        <div class="bar" class:offset={bar % 2 === 1}>
          {#each notesPerBar as _}
            <div class="note" />
          {/each}
        </div>
      {/each}
    </div>
  {/each}
</div>

<style>
  .main {
    --keyheight: 20px;
    --barwidth: 20px;
    --notewidth: 20px;
    --bg-h: var(--hsl__bg-h);
    --bg-s: var(--hsl__bg-s);
    --bg-l: var(--hsl__bg-l);
    --border-h: var(--hsl__bg2-h);
    --border-s: var(--hsl__bg2-s);
    --border-l: var(--hsl__bg2-l);
    --bg-hsl: hsla(var(--bg-h), var(--bg-s), var(--bg-l), 0.8);
    --bg-hover-hsl: hsla(var(--bg-h), var(--bg-s), var(--bg-l), 1);
    --row-offset-hsl: hsla(
      var(--bg-h),
      var(--bg-s),
      calc(var(--bg-l) - 20%),
      1
    );
    --border-hsl: hsla(var(--border-h), var(--border-s), var(--border-l), 1);
    --border-offset-hsl: hsla(
      var(--border-h),
      var(--border-s),
      calc(var(--border-l) + 10%),
      1
    );

    height: 100%;
    position: relative;
  }

  .timeline {
    position: sticky;
    height: 20px;
    left: 0;
    top: 0;
    background: var(--bg-hsl);
    border-bottom: 1px solid var(--border-hsl);
    display: flex;
    z-index: 1;
  }

  .row {
    height: var(--keyheight);
    border-bottom: 1px solid var(--border-hsl);
    display: flex;
    position: relative;
  }
  .row.offset {
    background: var(--row-offset-hsl);
  }
  .row.accent {
    border-bottom: 1px solid var(--border-offset-hsl);
  }
  .row.hover {
    background: var(--bg-hover-hsl);
  }

  .bar {
    width: var(--barwidth);
    display: flex;
    align-items: center;
    font-size: 8px;
    border-right: 1px solid
      hsla(var(--border-h), var(--border-s), calc(var(--border-l) + 30%), 1);
    background: var(--bg-hsl);
  }
  .bar.offset {
    /* background: hsla(calc(var(--bg-h) + 80), var(--bg-s), var(--bg-l), 1); */
  }

  .bar .note {
    flex: 1;
    border-right: 1px solid var(--border-hsl);
    height: 100%;
  }
  .bar .note:last-child {
    border-right: none;
  }
  .indicator {
    margin-left: 5px;
    font-weight: bold;
  }
</style>
