<script lang="ts">
  import { hoverKey, setHoverKey } from './pianoRollStore'
  import type { Instrument } from 'daw/core'
  import { objectStyle } from 'src/utils'
  import { audioContext } from 'daw/audioContext'

  export let key: number
  export let keyHeight: number = 20
  export let onMidi: Instrument['onMidi']
  export let horizontal = false

  function isBlackKey(key: number) {
    const note = key % 12
    return [1, 3, 6, 8, 10].includes(note)
  }

  function getOctave(key: number) {
    return Math.floor(key / 12) + 1
  }
</script>

<div
  class="key"
  class:horizontal
  class:hover={$hoverKey === key}
  class:black={isBlackKey(key)}
  style={objectStyle({
    '--whiteheight': `${keyHeight}px`,
  })}
  on:focus={() => {}}
  on:mousedown|stopPropagation={() => {
    onMidi({ type: 'noteOn', note: key, velocity: 100, endTick: 0.5 })
  }}
  on:mouseover={evt => {
    setHoverKey(key)
    if (evt.buttons) {
      onMidi({ type: 'noteOn', note: key, velocity: 100, endTick: 0.5 })
    }
  }}
>
  {#if key % 12 === 0}
    <div class="text">
      C{getOctave(key)}
    </div>
  {/if}
</div>

<style>
  .key {
    --whiteheight: 20px;
    --blackheight: calc(var(--whiteheight) / 2);

    box-sizing: border-box;
    transition: background 0.1s ease;
  }
  .key:not(.black) {
    height: var(--whiteheight);
    width: 100%;
    border-bottom: 1px solid var(--colors__fg2);
    border-right: 1px solid var(--colors__fg2);
    color: black;
    background: white;
    display: flex;
    align-items: center;
  }
  .black.key {
    position: relative;
    z-index: 1;
    height: 0;
  }
  .black.key:after {
    content: '';
    position: absolute;
    height: var(--blackheight);
    left: 0;
    bottom: calc(var(--blackheight) / -2);
    width: 70px;
    background: var(--colors__bg);
    z-index: 1;
  }

  .key.hover {
    background: hsl(
      var(--hsl__accent-h),
      var(--hsl__accent-s),
      calc(var(--hsl__accent-l) + 10%),
      1
    );
  }
  .key.hover:after {
    background: hsl(
      var(--hsl__accent-h),
      var(--hsl__accent-s),
      calc(var(--hsl__accent-l) + 10%),
      1
    );
  }

  .key.horizontal:not(.black) {
    width: var(--whiteheight);
    height: 100px;
    border-bottom: 1px solid var(--colors__fg2);
    border-right: 1px solid var(--colors__fg2);
    color: black;
    background: white;
    display: flex;
    align-items: flex-end;
  }
  .black.key.horizontal:after {
    width: var(--blackheight);
    top: 0;
    left: calc(var(--blackheight) / -2);
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
</style>
