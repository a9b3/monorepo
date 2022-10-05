<script lang="ts">
  import { objectStyle } from 'src/utils/objectToStyleStr'
  export let value = 0
  export let secondaryValue = 0
  export let maxCounter = 100
  export let featureHorizontal = false

  let runningMax = 0
  let counter = 0

  function valueToTransformTranslate(value: number) {
    const percentage = 100 - value
    const str = `${percentage < 0 ? 0 : percentage}%`
    return featureHorizontal ? `translateX(${str})` : `translateY(${str})`
  }

  $: {
    ;(() => {
      if (secondaryValue > runningMax) {
        runningMax = secondaryValue
      }

      if (counter === maxCounter) {
        counter = 0
        runningMax = secondaryValue
      }

      counter += 1
    })()
  }
</script>

<div
  class={($$restProps.class || '') + ' main'}
  class:horizontal={featureHorizontal}
  style={$$restProps.style}
>
  <div class="meter">
    <div class="peak" class:active={value >= 100} />
    <div
      class="max"
      style={objectStyle({
        transform: valueToTransformTranslate(runningMax),
      })}
    />
    <div
      class="secondary"
      style={objectStyle({
        transform: valueToTransformTranslate(secondaryValue),
      })}
    />
    <div
      class="inner"
      style={objectStyle({
        transform: valueToTransformTranslate(value),
      })}
    />
  </div>
</div>

<style>
  .main {
    --meter_bg: var(--colors__bg);
    --meter_color: var(--colors__accent);

    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--colors__bg3);
  }
  .meter {
    width: 100%;
    overflow: hidden;
    position: relative;
    min-width: 5px;
    height: 100%;
    min-height: 5px;
    display: flex;
    flex-direction: column;
    /* outline: 1px solid yellow; */
  }
  .peak {
    position: absolute;
    top: 0;
    width: '100%';
    height: '8px';
    margin-bottom: 5px;
    margin-right: 5px;
    border: 0.5px solid var(--colors__fg);
    background: var(--meter_bg);
  }
  .peak.active {
    background: var(--colors__bg3);
  }
  .inner {
    position: absolute;
    bottom: 0;
    height: 100%;
    width: 100%;
    background: var(--meter_color);
    /* background: black; */
  }
  .secondary {
    position: absolute;
    bottom: 0;
    align-self: flex-end;
    height: 100%;
    width: 100%;
    background: var(--meter_color);
    opacity: 0.4;
  }

  .max {
    position: absolute;
    height: 100%;
    width: 100%;
  }
  .max:before {
    content: '';
    position: absolute;
    height: 1px;
    width: 100%;
    background: var(--meter_color);
  }
</style>
