<script lang="ts">
  import {
    style,
    styleToSvelte,
  } from '@monorepo/orgs/examples/svelte-app/src/styles'

  export let title: string
</script>

<div class="header" style={styleToSvelte(style)}>
  <div class="icon">O</div>
  <div class="title">{title}</div>

  <div class="right">
    {#each ['Github', 'LinkedIn', 'Contact'] as el}
      <div>{el}</div>
    {/each}
  </div>
</div>

<style>
  .header {
    display: flex;
    border: var(--border);
    margin: var(--paddingSm);
    align-items: center;
  }
  .header > * {
    padding: var(--paddingSm);
  }

  .icon {
    border-right: var(--border);
  }

  .title {
    font-weight: 600;
  }

  .right {
    margin-left: auto;
    display: flex;
    padding: 0;
  }
  .right > * {
    padding: var(--paddingSm);
    border-left: var(--border);
  }
</style>
