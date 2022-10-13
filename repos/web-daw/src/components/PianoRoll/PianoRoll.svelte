<script lang="ts">
  import Keyboard from './Keyboard.svelte'
  import Arrangement from './Arrangement.svelte'
  import ResizerY from './Controls/ResizerY.svelte'
  import type { MidiClip } from 'daw/core/midi'
  import { objectStyle } from 'src/utils'

  export let numberOfKeys = 120
  export let numberOfBars = 4
  export let barDivision = 8
  export let startingKey = 60
  export let midiClip: MidiClip
  export let ticksPerBeat: number
  export let onMidi

  let keyHeight = 25
  let barWidth = 400
</script>

<div>
  <div class="controls">
    <ResizerY
      onResize={delta => {
        keyHeight += delta * 15
      }}
    />
  </div>
  <div class={'main'}>
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
