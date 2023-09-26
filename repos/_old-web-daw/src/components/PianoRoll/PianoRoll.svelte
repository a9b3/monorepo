<script lang="ts">
  import { onMount } from 'svelte'
  import Keyboard from './Keyboard.svelte'
  import Arrangement from './Arrangement.svelte'
  import ResizerY from './Controls/ResizerY.svelte'
  import type { MidiClip, Instrument } from 'daw/core'
  import type { SelectionManager } from 'src/ui'

  /**
   * Total number of notes to display.
   */
  export let numberOfKeys = 120
  /**
   * Total number of bars to display.
   */
  export let numberOfBars = 4
  /**
   * How should each bar be divided. This creates grid lines for each bar.
   * eg. barDivision of 8 would there are grid lines created for 8th notes.
   */
  export let barDivision = 8
  /**
   * Sets the first displayed note to the corresponding midi note.
   * eg. 88 key controller's first midi note is 21
   */
  export let offsetStartNote = 0
  /**
   * Scroll to this note on component mount.
   */
  export let scrollToNote = 60
  export let midiClip: MidiClip
  export let ticksPerBeat: number
  /**
   * UI interactions will preview midi playback.
   */
  export let onMidi: Instrument['onMidi']
  export let selectionManager: SelectionManager

  let scrollParent: HTMLElement

  // TODO these should probably move to a size manager class
  let keyHeight = 40
  let barWidth = 400

  onMount(() => {
    scrollParent.scrollTo(0, (keyHeight / 2) * scrollToNote)
  })
</script>

<div>
  <div class="controls">
    <ResizerY
      onResize={delta => {
        keyHeight += delta * 15
      }}
    />
  </div>
  <div class={'main'} bind:this={scrollParent}>
    <div class="keyboard">
      <Keyboard {onMidi} {numberOfKeys} {keyHeight} />
    </div>
    <div class="arrangement">
      <Arrangement
        {barDivision}
        {barWidth}
        {numberOfBars}
        {onMidi}
        {keyHeight}
        {numberOfKeys}
        {midiClip}
        {ticksPerBeat}
        {selectionManager}
      />
    </div>
  </div>
</div>

<style>
  .main {
    background: var(--colors__bg);
    max-height: 700px;
    overflow: auto;
    width: 100%;
    display: grid;
    grid-template: 'keyboard arrangement' auto / 100px 1fr;
    position: relative;
    overscroll-behavior: none;
  }

  .controls {
    background: var(--colors__bg);
    border-bottom: 1px solid var(--colors__bg2);
  }

  .keyboard {
    grid-area: keyboard;
    left: 0;
    position: sticky;
    z-index: 5;
  }

  .arrangement {
    grid-area: arrangement;
  }
</style>
