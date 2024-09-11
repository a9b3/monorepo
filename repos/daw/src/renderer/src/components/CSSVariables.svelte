<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import CSSVars from '@renderer/src/state/CSSVars'
  import shortcutManager from '@renderer/src/state/shortcutManager'
  import GenericTable from '@renderer/src/components/GenericTable.svelte'
  import Value from '@renderer/src/components/CSSVariables/Value.svelte'

  let show = false

  const columns = []

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
    <GenericTable
      tableHeight="100%"
      data={Object.entries(CSSVars.variables).map(([key, value]) => {
        return { id: key, name: key, value }
      })}
      columns={[
        { field: 'name', header: 'Name' },
        {
          field: 'value',
          header: 'Value',
          cellRenderer: Value,
          passProps: (row) => ({
            value: row.value,
            onChange: (value) => CSSVars.setAndApply(row.name, value)
          })
        }
      ]}
    />
  </main>
{/if}

<style>
  main {
    position: absolute;
    background: black;
    user-select: text;
    height: 100%;
    overflow: auto;
  }

  .variables {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    padding: 1rem;
    color: white;
  }
</style>
