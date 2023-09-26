<script lang="ts">
  import { objectStyle } from 'src/utils/objectToStyleStr'
  import { toClass } from 'src/utils'
  export let title = ''
  export let disabled = false
  export let align = 'center'
  export let compact = false

  const overrideStyle = compact
    ? objectStyle({
        height: '15px',
        padding: '4px 8px',
      })
    : ''
</script>

<div
  class={toClass([$$restProps.class, 'main', align])}
  class:disabled
  style={toClass([overrideStyle, $$restProps.style])}
  on:click
  on:mousedown
>
  {title}
  <slot />
</div>

<style>
  .main {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--colors__bg3);
    padding: 2px 12px;
    border-radius: 35px;
    height: 20px;
    color: var(--colors__fg2);
  }
  .main:hover {
    background-color: var(--colors__bg3Hover);
  }

  .main.disabled {
    color: var(--colors__fg3);
  }
  .main.disabled:hover {
    background-color: var(--colors__bg3);
  }

  .main.left {
    justify-content: flex-start;
  }
</style>
