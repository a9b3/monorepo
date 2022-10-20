<script lang="ts">
  import { onDestroy } from 'svelte'
  import { MidiEventTypes } from 'daw/core/midi'
  import { hoverKey, setHoverKey } from './pianoRollStore'
  import type { Instrument } from 'daw/core'
  import { objectStyle } from 'src/utils'
  import { isBlackKey, getOctave } from './midiGuiUtils'

  // -------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------

  export let key: number
  export let keyHeight: number = 20
  export let onMidi: Instrument['onMidi']
  export let horizontal = false
  export let pressed = false
  export let showHover = true

  // -------------------------------------------------------------------------
  // Internals
  // -------------------------------------------------------------------------

  let whiteKeyHeight = (keyHeight * 12) / 7
  let blackKeyHeight = whiteKeyHeight / 2

  onDestroy(() => {
    onMidi({ type: MidiEventTypes.noteOff, note: key, velocity: 0 })
  })
</script>

<div
  class="key"
  class:horizontal
  class:pressed
  class:hover={showHover && $hoverKey === key}
  class:black={isBlackKey(key)}
  style={objectStyle({
    '--whitekeyheight': `${whiteKeyHeight}px`,
    '--blackkeyheight': `${blackKeyHeight}px`,
  })}
  on:focus={() => {}}
  on:mousedown={() => {
    pressed = true
    onMidi({ type: MidiEventTypes.noteOn, note: key, velocity: 100 })
  }}
  on:mouseover={evt => {
    if (showHover) {
      setHoverKey(key)
    }
    if (evt.buttons) {
      pressed = true
      onMidi({ type: MidiEventTypes.noteOn, note: key, velocity: 100 })
    }
  }}
  on:mouseout={() => {
    pressed = false
    onMidi({ type: MidiEventTypes.noteOff, note: key, velocity: 0 })
  }}
  on:mouseup={() => {
    pressed = false
    onMidi({ type: MidiEventTypes.noteOff, note: key, velocity: 0 })
  }}
  on:blur={() => {}}
>
  {#if key % 12 === 0}
    <div class="text">
      C{getOctave(key)}
    </div>
  {/if}
</div>

<style>
  .key {
    --whitekeyheight: var(--whitekeyheight);
    --blackkeyheight: var(--blackkeyheight);

    /* transition: background 0.1s ease; */
  }
  .key:not(.black) {
    height: var(--whitekeyheight);
    width: 100%;
    border-bottom: 1px solid var(--colors__fg2);
    border-right: 1px solid var(--colors__fg2);
    color: black;
    background: white;
    display: flex;
    align-items: center;
  }
  .key.black {
    position: relative;
    z-index: 1;
    height: 0;
  }
  .key.black:after {
    content: '';
    position: absolute;
    height: var(--blackkeyheight);
    left: 0;
    bottom: calc(var(--blackkeyheight) / -2);
    width: 70px;
    background: linear-gradient(45deg, #222 0%, #555 100%);
    z-index: 1;
  }

  .key.horizontal:not(.black) {
    width: var(--whitekeyheight);
    height: 100px;
    border-bottom: 1px solid var(--colors__fg2);
    border-right: 1px solid var(--colors__fg2);
    color: black;
    background: white;
    display: flex;
    align-items: flex-end;
  }
  .key.black.horizontal:after {
    width: var(--blackkeyheight);
    top: 0;
    left: calc(var(--blackkeyheight) / -2);
    height: 70px;
    background: var(--colors__bg);
    z-index: 1;
  }

  .text {
    margin-left: auto;
    padding-right: 5px;
    font-size: 8px;
    font-weight: bold;
  }

  .key.hover,
  .key.hover:after,
  .key.hover.black:after,
  .key.hover.horizontal {
    background: hsl(
      var(--hsl__accent-h),
      var(--hsl__accent-s),
      calc(var(--hsl__accent-l) + 30%),
      1
    );
  }

  .key.pressed,
  .key.pressed.black:after,
  .key.pressed.horizontal {
    background: var(--colors__neonPink);
    box-shadow: 2px 0 3px rgba(0, 0, 0, 0.1) inset,
      -5px 5px 20px rgba(0, 0, 0, 0.2) inset, 0 0 3px rgba(0, 0, 0, 0.2);
    background: linear-gradient(to bottom, #fff 0%, #e9e9e9 100%);
  }
  .key.pressed.black:after {
    box-shadow: -1px -1px 2px rgba(255, 255, 255, 0.2) inset,
      0 -2px 2px 3px rgba(0, 0, 0, 0.6) inset, 0 1px 2px rgba(0, 0, 0, 0.5);
    background: linear-gradient(to right, #444 0%, #222 100%);
  }
</style>
