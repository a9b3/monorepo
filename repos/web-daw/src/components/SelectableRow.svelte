<!--
  @component

  Selectable row.
-->
<script lang="ts">
  export let selected = false
</script>

<div
  class={($$props.class || '') + ' main'}
  class:selected
  on:click
  style={$$restProps.style}
>
  <slot />
</div>

<style>
  .main {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .selected {
    background: var(--colors__selected);
    border-radius: var(--misc__borderRadius);
  }
</style>
