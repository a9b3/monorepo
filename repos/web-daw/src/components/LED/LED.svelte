<script lang="ts">
  import { objectStyle } from 'src/utils'

  export let color = 'green'
  export let size = '5px'
</script>

<div
  class="led"
  style={objectStyle({
    '--size': size,
    '--color-h': `var(--hsl__${color}-h)`,
    '--color-s': `var(--hsl__${color}-s)`,
    '--color-l': `var(--hsl__${color}-l)`,
  })}
/>

<style>
  .led {
    --size: 5px;
    --color-h: var(--hsl__green-h);
    --color-s: var(--hsl__green-s);
    --color-l: var(--hsl__green-l);

    width: var(--size);
    height: var(--size);
    border-radius: 100%;
    background: hsl(var(--color-h), var(--color-s), var(--color-l), 1);
    box-shadow: inset 0 1px 0 rgba(0, 0, 0, 0.1),
      0 1px 0 rgba(255, 255, 255, 0.1),
      0 0 30px
        hsl(var(--color-h), calc(var(--color-s) + 20%), var(--color-l), 1),
      inset 0 0 8px
        hsl(var(--color-h), calc(var(--color-s) + 20%), var(--color-l), 1),
      inset 0 -2px 5px hsl(var(--color-h), calc(var(--color-s) + 20%), var(--color-l), 1),
      inset 0 -3px 8px hsl(var(--color-h), calc(var(--color-s) + 20%), var(--color-l), 1);
    transition: background 0.2s;
  }
</style>
