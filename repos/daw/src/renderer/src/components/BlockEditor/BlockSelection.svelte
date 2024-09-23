<script lang="ts">
  export let onSelection: (type: string, properties?: Object) => void

  import { onMount, onDestroy } from 'svelte'
  import shortcutManager from '@renderer/src/stores/shortcutManager'
  import Table from '@renderer/src/components/generic/Table.svelte'

  let data = [
    {
      id: 'header',
      name: 'Header',
      properties: { level: 5, text: '' },
      description: 'A block that contains a title'
    },
    {
      id: 'code',
      name: 'Code',
      properties: {
        text: '',
        language: ''
      },
      description: 'A block that contains code'
    }
  ]
  let selectedRow = null

  function nextBlock() {
    if (selectedRow === null) {
      selectedRow = data[0].id
    } else {
      const idx = data.findIndex((row) => row.id === selectedRow)
      if (idx < data.length - 1) {
        selectedRow = data[idx + 1].id
      }
    }
  }

  function prevBlock() {
    if (selectedRow === null) {
      selectedRow = data[0].id
    } else {
      const idx = data.findIndex((row) => row.id === selectedRow)
      if (idx > 0) {
        selectedRow = data[idx - 1].id
      }
    }
  }

  function selectBlock() {
    const row = data.find((row) => row.id === selectedRow)
    onSelection(String(row.name).toLowerCase(), row.properties)
  }

  onMount(() => {
    $shortcutManager.manager.register({
      context: 'blockSelection',
      title: 'Block Selection',
      description: 'Block selection for the application',
      shortcuts: [
        {
          key: 'meta+j',
          title: 'Next Block',
          description: 'Select the next block type',
          action: nextBlock
        },
        {
          key: 'meta+k',
          title: 'Previous Block',
          description: 'Select the previous block type',
          action: prevBlock
        },
        {
          key: 'Enter',
          title: 'Select Block',
          description: 'Select the block type',
          action: selectBlock
        }
      ]
    })
    $shortcutManager.manager.pushActiveContext('blockSelection')
  })

  onDestroy(() => {
    $shortcutManager.manager.popActiveContext('blockSelection')
  })
</script>

<div class="main">
  <Table
    {data}
    onRowClick={(row) => {
      onSelection(String(row.name).toLowerCase(), row.properties)
    }}
    highlightRows={[selectedRow]}
    showHeader={false}
    gridTemplateColumns="1fr 2fr"
    columns={[
      { field: 'name', header: 'Name' },
      { field: 'description', header: 'Description' }
    ]}
  />
</div>

<style>
  .main {
    width: 300px;
  }
</style>
