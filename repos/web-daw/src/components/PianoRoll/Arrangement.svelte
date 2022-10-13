<!--
  @component

  The arrangement view for the piano roll.
-->
<script lang="ts">
  import { beforeUpdate } from 'svelte'
  import { objectStyle } from 'src/utils'
  import CursorLine from './CursorLine/CursorLine.svelte'
  import type { MidiClip, EventsMap } from 'daw/core/midi'
  import {
    mouseDown,
    setMouseDown,
    hoverKey,
    setHoverKey,
    snapEnabled,
  } from './pianoRollStore'
  import MidiEvent from './MidiEvent.svelte'

  export let numberOfKeys: number
  export let keyHeight: number
  export let barWidth: number
  export let numberOfBars: number
  export let ticksPerBeat: number
  export let barDivision: number
  export let onMidi
  export let midiClip: MidiClip

  // Total ticks in current arrangement view
  $: totalTicks = numberOfBars * 4 * ticksPerBeat

  function addEvent(
    evt: MouseEvent,
    { note, snapEnabled, ticksPerBeat, totalTicks },
    onAdd
  ) {
    const startTick =
      (evt.target.offsetLeft / evt.target.offsetParent.offsetWidth) * totalTicks
    const endTick =
      startTick +
      (evt.target.offsetWidth / evt.target.offsetParent.offsetWidth) *
        totalTicks

    onAdd({ note, startTick, endTick })
  }

  function transformEventsMap(copy: EventsMap): {
    [note: string]: [{ id: string; startTick: number; endTick: number }]
  } {
    const eventsMap = { ...copy }
    let transformed = {}

    const allTicks = Object.keys(eventsMap)
    const sorted = allTicks.sort((a, b) => (Number(a) < Number(b) ? -1 : 1))

    for (let i = 0; i < sorted.length; i++) {
      const curTick = sorted[i]
      const notes = Object.keys(eventsMap[String(curTick)])
      for (let j = 0; j < notes.length; j++) {
        const note = String(notes[j])
        transformed[note] = transformed[note] || []
        transformed = { ...transformed }

        Object.values(eventsMap[String(curTick)][note]).forEach(midiEvent => {
          if (midiEvent.type === 'noteOn') {
            transformed[note] = [
              ...transformed[note],
              { id: midiEvent.id, startTick: curTick, endTick: undefined },
            ]
          } else if (midiEvent.type === 'noteOff') {
            for (let k = 0; k < transformed[note].length; k++) {
              if (transformed[note][k].endTick === undefined) {
                transformed[note][k].endTick = curTick
              }
            }
          }
        })
      }
    }
    return transformed
  }
  $: transformedMap = transformEventsMap($midiClip.eventsMap)

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

  function mouseup() {
    setMouseDown(false)
  }
</script>

<div
  class={($$restProps.class || '') + ' main'}
  style={objectStyle({
    '--keyheight': `${(keyHeight * 7) / 12}px`,
    '--barwidth': `${barWidth}px`,
    '--notewidth': `${barWidth / barDivision}px`,
  })}
>
  <CursorLine numberOfBeats={numberOfBars * 4} />
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
      on:mousedown|stopPropagation={evt => {
        onMidi({ type: 'noteOn', note: row, velocity: 67 })
        setMouseDown(true)
        window.addEventListener('mouseup', mouseup)
        addEvent(
          evt,
          { note: row, snapEnabled: $snapEnabled, ticksPerBeat, totalTicks },
          ({ note, startTick, endTick }) => {
            $midiClip.addEvent(Math.floor(startTick), {
              type: 'noteOn',
              note,
              velocity: 67,
            })
            $midiClip.addEvent(Math.floor(endTick) - 1, {
              type: 'noteOff',
              note,
              velocity: 67,
            })
          }
        )
      }}
      on:mouseover={() => {
        setHoverKey(row)
        if ($mouseDown) {
          onMidi({ note: row })
        }
      }}
    >
      {#if transformedMap[String(row)]}
        {#each transformedMap[String(row)] as transformedMidiEvent, idx}
          {#key transformedMidiEvent.id}
            <MidiEvent
              midiEvent={transformedMidiEvent}
              ticksPerBeat={960}
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
    --offset-hsl: hsla(var(--bg-h), var(--bg-s), calc(var(--bg-l) - 5%), 0.7);
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
  }

  .row {
    height: var(--keyheight);
    border-bottom: 1px solid var(--border-hsl);
    display: flex;
    position: relative;
  }
  .row.offset {
    background: var(--offset-hsl);
  }
  .row.accent {
    border-bottom: 1px solid var(--border-offset-hsl);
  }
  .row.hover {
    opacity: 0.5;
  }

  .bar {
    width: var(--barwidth);
    display: flex;
    align-items: center;
    font-size: 8px;
    border-right: 1px solid
      hsl(var(--border-h), var(--border-s), calc(var(--border-l) + 10%), 1);
    background: var(--bg-hsl);
  }
  .bar.offset {
    background: var(--offset-hsl);
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
    color: hsl(var(--bg-h), var(--bg-s), calc(var(--bg-l) + 20%), 1);
  }
</style>
