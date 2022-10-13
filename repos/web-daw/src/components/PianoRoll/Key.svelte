<script lang="ts">
  import {
    mouseDown,
    setMouseDown,
    hoverKey,
    setHoverKey,
  } from './pianoRollStore'
  import { objectStyle } from 'src/utils'

  export let key: number
  export let keyHeight: number = 20
  export let onMidi

  function isBlackKey(key: number) {
    const note = key % 12
    return [1, 3, 6, 8, 10].includes(note)
  }

  function getOctave(key: number) {
    return Math.floor(key / 12) + 1
  }

  function mouseup() {
    setMouseDown(false)
  }
</script>

<div
  class="key"
  class:hover={$hoverKey === key}
  class:black={isBlackKey(key)}
  style={objectStyle({
    '--whiteheight': `${keyHeight}px`,
  })}
  on:focus={() => {}}
  on:mousedown|stopPropagation={() => {
    onMidi({ note: key })
    setMouseDown(true)
    window.addEventListener('mouseup', mouseup)
  }}
  on:mouseover={() => {
    setHoverKey(key)
    if ($mouseDown) {
      onMidi({ note: key })
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

  .text {
    margin-left: auto;
    padding-right: 5px;
    font-size: 8px;
    font-weight: bold;
  }
</style>
