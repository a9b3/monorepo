<!--
  @component

  Piano roll editor for midi clips.
-->
<script lang="ts">
  import { onMount } from 'svelte'
  import Keyboard from './Keyboard.svelte'
  import Arrangement from './Arrangement.svelte'
  import ResizerY from './Controls/ResizerY.svelte'
  import type { MidiClip, Instrument } from 'daw/core'
  import type { SelectionManager } from 'src/ui'

  // -------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------

  /**
   * Total number of notes to display.
   * TODO this has to be multiples of 12 since keyboard being black and white
   * keys of uneven heights will not align with all even rows in the
   * arrangement component unless its multiples of 12.
   */
  export let numberOfKeys = 84
  /**
   * Total number of bars to display.
   */
  export let numberOfBars: number
  /**
   * How should each bar be divided. This creates grid lines for each bar.
   * eg. barDivision of 8 would there are grid lines created for 8th notes.
   */
  export let barDivision = 8
  /**
   * Sets the first displayed note to the corresponding midi note.
   * eg. 88 key controller's first midi note is 21
   */
  export let offsetStartNote = 24
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

  // -------------------------------------------------------------------------
  // Internal State
  // -------------------------------------------------------------------------

  let scrollParent: HTMLElement

  // Height of each row in the Arrangement component
  let keyHeight = 20
  let barWidth = 400
  let spacerSize = 20

  onMount(() => {
    scrollParent.scrollTo(
      0,
      scrollParent.scrollHeight *
        ((scrollToNote - offsetStartNote) / numberOfKeys)
    )
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
  <div class="main" bind:this={scrollParent}>
    <div class="keyboard">
      <Keyboard
        {onMidi}
        {numberOfKeys}
        {keyHeight}
        {offsetStartNote}
        {spacerSize}
      />
    </div>
    <div class="arrangement">
      <Arrangement
        {barDivision}
        {barWidth}
        {keyHeight}
        {midiClip}
        {numberOfBars}
        {numberOfKeys}
        {offsetStartNote}
        {onMidi}
        {selectionManager}
        {spacerSize}
        {ticksPerBeat}
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
