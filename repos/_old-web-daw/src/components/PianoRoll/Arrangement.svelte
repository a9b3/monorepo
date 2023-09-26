<!--
  @component

  The arrangement view for the piano roll.
-->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { objectStyle } from 'src/utils'
  import CursorLine from './CursorLine/CursorLine.svelte'
  import type { SelectionManager } from 'src/ui'
  import { ModKeys } from 'src/ui'
  import { ContextMenu } from 'src/components'
  import type { MidiClip, MidiEvent as MidiEventT } from 'daw/core/midi'
  import type { Instrument } from 'daw/core'
  import { hoverKey, setHoverKey, snapEnabled } from './pianoRollStore'
  import { keyboardStore } from 'src/store/keyboard'
  import Selection from '../Selection/Selection.svelte'
  import MidiClipPreview from './MidiClipPreview.svelte'
  import {
    singlePointToMidiEvent,
    rectToMidiEvent,
    containerMouseXY,
    noteHeight,
  } from './midiGuiUtils'

  export let numberOfKeys: number
  export let keyHeight: number
  export let barWidth: number
  export let numberOfBars: number
  export let ticksPerBeat: number
  export let barDivision: number
  export let onMidi: Instrument['onMidi']
  export let midiClip: MidiClip
  export let selectionManager: SelectionManager
  export let startingNote: number = 21

  let container: HTMLElement
  let selectionContainer: HTMLElement
  let mouseOverNotes = false

  // Total ticks in current arrangement view
  $: totalTicks = numberOfBars * 4 * ticksPerBeat
  let selectionModKey = ModKeys.Meta

  // Initialize the grid
  let rows = Array(numberOfKeys)
    .fill(1)
    .map((_, i) => i + startingNote)
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
    keyboardStore.attach('Backspace', {
      key: 'arrangementDelete',
      handler: () => {
        Object.keys(selectionManager.selected).forEach(id => {
          midiClip.remove(id)
        })
      },
    })
    window.addEventListener('mouseup', onmouseup)
  })
  onDestroy(() => {
    keyboardStore.detach('Backspace', 'arrangementDelete')
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
  <div class="rows" bind:this={selectionContainer}>
    {#if selectionContainer}
      <Selection
        {selectionManager}
        container={selectionContainer}
        modKey={selectionModKey}
        snapRow={noteHeight(numberOfKeys, selectionContainer.offsetHeight)}
        snapColumn={selectionContainer.offsetWidth / numberOfBars / barDivision}
        onMoveFinish={selected => {
          selected.forEach(({ id }) => {
            midiClip.remove(id)
          })
          selected.forEach(({ id, el, rect }) => {
            const midiEvt = rectToMidiEvent(
              rect,
              selectionContainer,
              numberOfKeys,
              totalTicks
            )

            midiClip.insert({
              type: 'noteOn',
              note: midiEvt.note,
              velocity: 100,
              startTick: midiEvt.startTick,
              endTick: midiEvt.endTick - 1,
              id,
            })
          })
        }}
      />
    {/if}
    <div class="test">
      {#key keyHeight}
        <MidiClipPreview
          {midiClip}
          displayNoteRange={{ min: 0, max: numberOfKeys - 1 }}
          {selectionManager}
        />
      {/key}
    </div>
    {#each rows as row}
      <div
        class="row"
        class:offset={row % 2 === 0}
        class:accent={[0, 5].includes(row % 12)}
        class:hover={$hoverKey === row}
        on:focus={() => {}}
        on:mousedown={evt => {
          if (selectionModKey && evt[selectionModKey]) {
            return
          }

          mouseOverNotes = true
          onMidi({ type: 'noteOn', note: row, velocity: 67, endTick: 0.5 })

          const mouseXY = containerMouseXY(evt, selectionContainer)
          const { note, startTick } = singlePointToMidiEvent(
            mouseXY.x,
            mouseXY.y,
            selectionContainer,
            {
              totalNotes: numberOfKeys,
              totalTicks,
              tickDivision: (ticksPerBeat * 4) / barDivision,
            }
          )

          midiClip.insert({
            type: 'noteOn',
            note,
            velocity: 70,
            startTick: startTick,
            endTick:
              Math.floor(startTick + (ticksPerBeat * 4) / barDivision) - 1,
          })
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

  .rows {
    position: relative;
    box-sizing: border-box;
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
    box-sizing: border-box;
    width: var(--barwidth);
    display: flex;
    align-items: center;
    font-size: 8px;
    border-right: 1px solid
      hsla(var(--border-h), var(--border-s), calc(var(--border-l) + 30%), 1);
    background: var(--bg-hsl);
  }
  .bar.offset {
    background: hsla(calc(var(--bg-h) + 80), var(--bg-s), var(--bg-l), 1);
  }

  .bar .note {
    flex: 1;
    box-sizing: border-box;
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

  .test {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
