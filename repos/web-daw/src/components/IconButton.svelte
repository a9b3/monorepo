<script lang="ts">
  export let active = false
  export let disabled = false
</script>

<div
  class={($$restProps.class || '') + ' main'}
  style={$$restProps.style}
  class:active
  class:disabled
  on:click
>
  <slot />
</div>

<style>
  .main {
    padding: var(--spacing__paddingM);
    border: 1px solid var(--colors__bg2);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
  }
  .main:hover {
    filter: brightness(0.8);
  }
  .main.active {
    background: var(--colors__accent);
    border: 1px solid var(--colors__accent);
  }
  .main.disabled {
  }
  .main.disabled:hover {
    filter: unset;
  }
</style>
