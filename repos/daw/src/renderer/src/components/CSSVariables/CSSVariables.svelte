<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import CSSVars from '@renderer/src/state/CSSVars'
  import shortcutManager from '@renderer/src/state/shortcutManager'
  import Table from '@renderer/src/components/generic/Table.svelte'
  import Value from './Value.svelte'

  let show = false

  onMount(() => {
    CSSVars.applyVariables()
    shortcutManager.register({
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
    shortcutManager.pushActiveContext('CSSVariables')
  })
  onDestroy(() => {})
</script>

{#if show}
  <main>
    <Table
      data={Object.entries(CSSVars.variables).map(([key, value]) => {
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
            onChange: (value) => CSSVars.setAndApply(row.name, value)
          })
        }
      ]}
    />
    <button
      on:click={() => {
        navigator.clipboard.writeText(CSSVars.toJSON())
      }}
    >
      Click to copy values
    </button>
  </main>
{/if}

<style>
  main {
    position: absolute;
    height: 100%;
    overflow: auto;
    background-color: var(--colors-bg);
  }
</style>
