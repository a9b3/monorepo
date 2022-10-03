<script lang="ts">
  export let type = 'row'
  export let padding = 'var(--spacing__paddingM)'

  const overrideStyle = `--padding: ${padding};`
</script>

<div class={$$restProps.class || ''}>
  <div class="layout {type ? type : ''}" style={overrideStyle}>
    <slot />
  </div>
</div>

<style>
  .layout.row {
    display: flex;
    flex-direction: row;
  }
  .layout.row > :global(*) {
    margin-right: var(--padding);
  }
  .layout.row > :global(*:last-child) {
    margin-right: 0;
  }

  .layout.col {
    display: flex;
    flex-direction: column;
  }
  .layout.col > :global(*) {
    margin-bottom: var(--padding);
  }
  .layout.col > :global(*:last-child) {
    margin-bottom: 0;
  }
</style>
