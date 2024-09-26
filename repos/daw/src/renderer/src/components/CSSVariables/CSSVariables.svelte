<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import themeStore from '@renderer/src/stores/theme'
  import shortcutManager from '@renderer/src/stores/shortcutManager'
  import Table from '@renderer/src/components/generic/Table.svelte'
  import Value from './Value.svelte'

  let show = false

  onMount(() => {
    $themeStore.theme.applyVariables()
    $shortcutManager.manager.register({
      context: 'CSSVariables',
      title: 'CSS Variables',
      description: 'Shortcuts for CSS Variables',
      shortcuts: [
        {
          key: 'meta+shift+d',
          description: 'Show/Hide CSS Variables Panel',
          action: () => {
            show = !show
          }
        },
        {
          key: 'Escape',
          description: 'Close CSS Variables Panel',
          action: () => {
            show = false
          }
        }
      ]
    })
    $shortcutManager.manager.pushActiveContext('CSSVariables')
  })

  onDestroy(() => {
    $shortcutManager.manager.popActiveContext('CSSVariables')
  })
</script>

{#if show}
  <main class="app-win-border">
    <Table
      data={Object.entries($themeStore.theme.variables).map(([key, value]) => {
        return { id: key, name: key, value }
      })}
      columns={[
        { field: 'name', header: 'Name' },
        {
          field: 'value',
          header: 'Value',
          cellComponent: Value,
          passProps: (row) => ({
            value: row.value,
            onChange: (value) => $themeStore.theme.setAndApply(row.name, value)
          })
        }
      ]}
    />
    <button
      on:click={() => {
        navigator.clipboard.writeText($themeStore.theme.toJSON())
      }}
    >
      Click to copy values
    </button>
  </main>
{/if}

<style>
  main {
    z-index: 2000;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border: var(--border);
    background: var(--colors-bg);
    width: 500px;
    overflow: auto;
  }
</style>
