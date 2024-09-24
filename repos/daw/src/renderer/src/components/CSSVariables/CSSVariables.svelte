<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import cssVarStore from '@renderer/src/stores/cssVars'
  import shortcutManager from '@renderer/src/stores/shortcutManager'
  import Table from '@renderer/src/components/generic/Table.svelte'
  import Value from './Value.svelte'

  let show = false

  onMount(() => {
    $cssVarStore.cssVars.applyVariables()
    $shortcutManager.manager.register({
      context: 'CSSVariables',
      title: 'CSS Variables',
      description: 'Shortcuts for CSS Variables',
      shortcuts: [
        {
          key: 'meta+shift+d',
          action: () => {
            show = !show
          }
        }
      ]
    })
    $shortcutManager.manager.pushActiveContext('CSSVariables')
  })
  onDestroy(() => {})
</script>

{#if show}
  <main>
    <Table
      data={Object.entries($cssVarStore.cssVars.variables).map(([key, value]) => {
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
            onChange: (value) => $cssVarStore.cssVars.setAndApply(row.name, value)
          })
        }
      ]}
    />
    <button
      on:click={() => {
        navigator.clipboard.writeText($cssVarStore.cssVars.toJSON())
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
    border-radius: 4px;
    overflow: auto;
  }
</style>
