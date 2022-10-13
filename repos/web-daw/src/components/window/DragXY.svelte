<!--
  @component

  Get the x, y delta from drag motions upon dragging this component. Attach a
  callback to this component to use to adjust some parent component.
-->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  export let onDrag: (x: number, y: number) => void

  let el: HTMLElement
  let curX
  let curY

  function onmousedown(evt) {
    curX = evt.clientX
    curY = evt.clientY

    console.log(`here`)

    window.addEventListener('mousemove', onmousemove)
    window.addEventListener('mouseup', onmouseup)
  }

  function onmousemove(evt) {
    onDrag(evt.clientX - curX, evt.clientY - curY)
    curX = evt.clientX
    curY = evt.clientY
  }

  function onmouseup() {
    window.removeEventListener('mousemove', onmousemove)
    window.removeEventListener('mouseup', onmouseup)
  }

  onMount(() => {
    el.addEventListener('mousedown', onmousedown)
  })
  onDestroy(() => {
    el.removeEventListener('mousedown', onmousedown)
  })
</script>

<div
  class={($$restProps.class || '') + ' main'}
  style={$$restProps.style}
  bind:this={el}
/>

<style>
  .main {
  }
</style>
