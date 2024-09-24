<script lang="ts">
  export let onClick: () => void = () => {}
</script>

<button class="main" on:click={onClick}>
  <slot></slot>
</button>

<style>
  .main {
    padding: var(--spacing-xxs) var(--spacing-xs);
    border: 1px solid var(--colors-fg);
    background: var(--colors-bg);
    color: var(--colors-fg);
    background: var(--colors-bg);
    font-size: var(--base-font-size);
    font-family: var(--font-family);
  }

  .main:hover {
    background: var(--colors-fg);
    color: var(--colors-bg);
  }
</style>
