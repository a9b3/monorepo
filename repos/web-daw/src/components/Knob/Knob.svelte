<script lang="ts">
  import { objectStyle } from 'src/utils/objectToStyleStr'
  import { useDelta } from './useDelta'

  export let setValue: (currentValue: number) => void
  export let value: number

  let currentValue = value
  let pxRange = 100

  const onDoubleClick = () => {
    currentValue = 0
    setValue(currentValue)
  }
  const getStyles = (val: number) => {
    const pos = val * pxRange
    return objectStyle({
      transform: `rotate(${pos}deg)`,
    })
  }
  const deltaset = useDelta(
    delta => {
      if (currentValue + delta > 1) {
        currentValue = 1
      } else if (currentValue + delta < -1) {
        currentValue = -1
      } else {
        currentValue = currentValue + delta
      }
      if (setValue) {
        setValue(currentValue)
      }
    },
    { pxRange: 100 }
  )
</script>

<div
  class={($$restProps.class || '') + ' main'}
  style={$$restProps.style}
  use:deltaset
>
  <div class="knob-inner" on:dblclick={onDoubleClick}>
    <div class="knob-indicator" style={getStyles(currentValue)} />
  </div>
</div>

<style>
  .main {
    --size: 30px;
    --color: var(--colors__bg2);

    margin: 10px;
    overflow: visible;
    display: flex;
    direction: column;
    justify-content: center;
    align-items: center;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    position: relative;
    background: var(--color);
  }
  .knob-inner {
    width: calc(var(--size) * 0.85);
    height: calc(var(--size) * 0.85);
    border-radius: 50%;
    background-color: var(--color);
    box-shadow: 0 0.2em 0.1em 0.05em rgba(255, 255, 255, 0.1) inset,
      0 -0.2em 0.1em 0.05em rgba(0, 0, 0, 0.5) inset,
      0 0.5em 0.65em 0 rgba(0, 0, 0, 0.3);
    position: relative;
  }
  .knob-indicator {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
  }
  .knob-indicator:after {
    content: '';
    position: absolute;
    top: 0;
    right: 50%;
    height: calc(var(--size) / 4);
    width: 2px;
    transform: translate(50%, 0);
    background: white;
  }
</style>
