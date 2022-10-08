<script lang="ts">
  import { objectStyle } from 'src/utils/objectToStyleStr'
  import { useSlider } from './useSlider'

  export let value: number
  export let onChange: (arg0: number) => void

  let el: HTMLElement

  let currentValue = value
  const slider = useSlider(v => {
    currentValue = v
    onChange(1 - currentValue)
  })

  function calcStyle() {
    if (!el) {
      return ``
    }
    const top = currentValue * el.offsetHeight
    return objectStyle({
      top: `${top}px`,
    })
  }
</script>

<div
  bind:this={el}
  use:slider
  class={($$restProps.class || '') + ' main'}
  style={$$restProps.style}
>
  <div class="bg" />
  <div class="slider" style={calcStyle(currentValue)} />
</div>

<style>
  .main {
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 20px;
  }

  .bg {
    height: 100%;
    width: 5px;
    border-radius: 2px;
    background: var(--colors__bg);
  }

  .slider {
    position: absolute;
    height: 10px;
    width: 20px;
    border-radius: 5px;
    background: var(--colors__bg3);
    border: 1px solid var(--colors__bg2);
    box-shadow: 0px 2px 2px rgba(black, 0.1);
  }
</style>
