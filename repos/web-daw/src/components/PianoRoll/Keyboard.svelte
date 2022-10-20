<!--
  @component

  A generic keyboard component.

  To allow clicking on keys to play midi supply an onMidi callback.
-->
<script lang="ts">
  import type { Instrument } from 'daw/core'
  import { objectStyle } from 'src/utils'
  import Key from './Key.svelte'

  // -------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------

  /**
   * Total number of notes to display for the keyboard.
   */
  export let numberOfKeys: number = 88
  /**
   * The height of each key, this will be divided in half for each
   */
  export let keyHeight: number
  /**
   * UI interactions will preview midi playback.
   */
  export let onMidi: Instrument['onMidi']
  /**
   * Show the keyboard horizontally.
   */
  export let horizontal = false
  /**
   * Sets the first displayed note to the corresponding midi note.
   * eg. 88 key controller's first midi note is 21
   */
  export let offsetStartNote = 21
  // Used if next to arrangement view to offset the height of the timeline.
  export let spacerSize = 20
  export let showHover = true

  // -------------------------------------------------------------------------
  // Internals
  // -------------------------------------------------------------------------

  let keys = Array(numberOfKeys)
    .fill(1)
    .map((_, i) => offsetStartNote + i)
    .reverse()
</script>

<div
  class={'keyboard'}
  class:horizontal
  style={objectStyle({
    '--spacersize': spacerSize + 'px',
  })}
>
  <div class="spacer" />
  {#each keys as key}
    <Key {key} {onMidi} {keyHeight} {horizontal} {showHover} />
  {/each}
</div>

<style>
  .keyboard {
    --spacersize: var(--spacersize);

    position: relative;
    height: var(--keyboardsize);
  }

  .spacer {
    height: var(--spacersize);
    position: sticky;
    top: 0;
    left: 0;
    background: var(--colors__bg);
    border-bottom: 1px solid var(--colors__bg2);
    border-right: 1px solid var(--colors__bg);
    z-index: 2;
  }

  .horizontal {
    height: unset;
    display: flex;
    flex-direction: row-reverse;
  }
</style>
