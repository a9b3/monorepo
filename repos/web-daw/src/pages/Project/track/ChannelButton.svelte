<script lang="ts">
  import { objectStyle } from 'src/utils'
  export let active = false
  export let color = 'var(--tokens__red)'
</script>

<div
  class="button"
  style={objectStyle({
    '--color': color,
  })}
  class:active
  on:mousedown
>
  <slot />
</div>

<style>
  .button {
    --color: var(--tokens__red)

    border: 1px solid var(--colors__fg3);
    color: var(--colors__fg3);
    width: 17px;
    height: 17px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--colors__bg);
    background: var(--colors__fg3);
  }
  .button:hover {
    transform: scale(1.2);
  }
  .button.active {
    border: 1px solid var(--color);
    color: var(--colors__fg);
    background: var(--color);
  }
</style>
