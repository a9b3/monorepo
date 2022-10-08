<script lang="ts">
  export let type: 'row' | 'col' = 'row'
  export let padding: string = 'var(--spacing__paddingM)'
  export let align: 'center' | 'start' = 'start'

  const overrideStyle = `--padding: ${padding};`
</script>

<div class={$$restProps.class || ''}>
  <div
    class:center={align === 'center'}
    class:start={align === 'start'}
    class="layout {type ? type : ''}"
    style={overrideStyle}
  >
    <slot />
  </div>
</div>

<style>
  .layout {
    overflow: inherit;
  }

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

  .layout.center {
    align-items: center;
  }
  .layout.start {
    align-items: flex-start;
  }
</style>
