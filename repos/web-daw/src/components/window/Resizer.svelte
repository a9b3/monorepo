<script lang="ts">
  import { onMount, onDestroy } from 'svelte'

  // -------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------

  export let onChange: Function
  export let onStart: Function

  // -------------------------------------------------------------------------
  // Internals
  // -------------------------------------------------------------------------

  let originX = 0
  let originY = 0
  let eResize: HTMLElement
  let seResize: HTMLElement
  let sResize: HTMLElement
  let swResize: HTMLElement
  let wResize: HTMLElement
  let direction

  function mousedown(evt: MouseEvent) {
    let type
    if (evt.target === eResize) {
      direction = 'x'
      type = 'e-resize'
    } else if (evt.target === seResize) {
      direction = 'xy'
      type = 'se-resize'
    } else if (evt.target === sResize) {
      direction = 'y'
      type = 's-resize'
    } else if (evt.target === swResize) {
      direction = 'xy'
      type = 'sw-resize'
    } else if (evt.target === wResize) {
      direction = 'x'
      type = 'w-resize'
    }

    document.body.style.cursor = type
    originX = evt.clientX
    originY = evt.clientY

    onStart()

    window.addEventListener('mousemove', mousemove)
    window.addEventListener('mouseup', mouseup)
  }

  function mousemove(evt: MouseEvent) {
    const deltaX = evt.clientX - originX
    const deltaY = evt.clientY - originY

    if (direction === 'x') {
      onChange({ deltaX, deltaY: 0 })
    } else if (direction === 'xy') {
      onChange({ deltaX, deltaY })
    } else {
      onChange({ deltaX: 0, deltaY })
    }
  }

  function mouseup() {
    document.body.style.cursor = 'default'
    window.removeEventListener('mousemove', mousemove)
    window.removeEventListener('mouseup', mouseup)
  }

  onMount(() => {
    eResize.addEventListener('mousedown', mousedown)
    seResize.addEventListener('mousedown', mousedown)
    sResize.addEventListener('mousedown', mousedown)
    swResize.addEventListener('mousedown', mousedown)
    wResize.addEventListener('mousedown', mousedown)
  })
  onDestroy(() => {
    eResize.removeEventListener('mousedown', mousedown)
    seResize.removeEventListener('mousedown', mousedown)
    sResize.removeEventListener('mousedown', mousedown)
    swResize.removeEventListener('mousedown', mousedown)
    wResize.removeEventListener('mousedown', mousedown)
  })
</script>

<div class="e-resize" bind:this={eResize} />
<div class="se-resize" bind:this={seResize} />
<div class="s-resize" bind:this={sResize} />
<div class="sw-resize" bind:this={swResize} />
<div class="w-resize" bind:this={wResize} />

<style>
  .e-resize,
  .se-resize,
  .s-resize,
  .sw-resize,
  .w-resize {
    position: absolute;
  }
  .e-resize {
    right: -4px;
    top: 0;
    height: 100%;
    width: 8px;
    z-index: 9;
    cursor: e-resize;
  }
  .se-resize {
    right: -4px;
    bottom: -4px;
    z-index: 10;
    width: 8px;
    height: 8px;
    cursor: se-resize;
  }
  .s-resize {
    bottom: -4px;
    left: 0;
    z-index: 9;
    width: 100%;
    height: 8px;
    cursor: s-resize;
  }
  .w-resize {
    left: -4px;
    top: 0;
    height: 100%;
    width: 8px;
    z-index: 9;
    cursor: w-resize;
  }
  .sw-resize {
    left: -4px;
    bottom: -4px;
    z-index: 10;
    width: 8px;
    height: 8px;
    cursor: sw-resize;
  }
</style>
