<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { objectStyle } from 'src/utils/objectToStyleStr'
  import { useSlider } from './useSlider'

  // range 0 - 1
  export let value: number
  export let onChange: (arg0: number) => void

  let container: HTMLElement
  let knob: HTMLElement

  function getValue(evt: MouseEvent) {
    let newValue =
      (container.offsetHeight -
        (evt.clientY - container.getBoundingClientRect().top)) /
      container.offsetHeight
    newValue = newValue > 1 ? 1 : newValue
    newValue = newValue < 0 ? 0 : newValue
    return newValue
  }

  function setKnob(container: HTMLElement, knob: HTMLElement, value: number) {
    const pxValue = Math.floor(container.offsetHeight * value)
    knob.style.transform = `translateY(${container.offsetHeight - pxValue}px)`
    onChange(value)
  }

  function onmousemove(evt: MouseEvent) {
    setKnob(container, knob, getValue(evt))
  }

  function onmouseup(evt: MouseEvent) {
    window.removeEventListener('mousemove', onmousemove)
    window.removeEventListener('mouseup', onmouseup)
  }

  function onmousedown(evt: MouseEvent) {
    setKnob(container, knob, getValue(evt))
    window.addEventListener('mousemove', onmousemove)
    window.addEventListener('mouseup', onmouseup)
  }

  onMount(() => {
    setKnob(container, knob, value ?? 1)
    container.addEventListener('mousedown', onmousedown)
  })
  onDestroy(() => {
    container.removeEventListener('mousedown', onmousedown)
  })
</script>

<div bind:this={container} class={'main'}>
  <div class="bg" />
  <div class="knob" bind:this={knob} />
</div>

<style>
  .main {
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 20px;
  }

  .bg {
    height: 100%;
    width: 5px;
    border-radius: 2px;
    background: var(--colors__bg);
  }

  .knob {
    position: absolute;
    height: 10px;
    width: 20px;
    border-radius: 5px;
    background: var(--colors__bg3);
    border: 1px solid var(--colors__bg2);
    box-shadow: 0px 2px 2px rgba(black, 0.1);
  }
</style>
