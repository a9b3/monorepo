<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import shortcutManager from '@renderer/src/stores/shortcutManager'
  import Table from '@renderer/src/components/generic/Table.svelte'

  export let onSelection: (type: string, properties?: Object) => void

  let data = [
    {
      id: 'header',
      name: 'Header',
      properties: { level: 5, text: '' },
      description: 'Header text'
    },
    {
      id: 'code',
      name: 'Code',
      properties: {
        text: '',
        language: ''
      },
      description: 'Display code with syntax highlighting'
    },
    {
      id: 'listItem',
      name: 'Bullet List Item',
      properties: {
        text: '',
        listType: 'bullet',
        indentLevel: 0
      },
      description: 'Bullet list item'
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
    onSelection(row.id, row.properties)
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
          action: selectBlock,
          preventDefault: true,
          stopPropagation: true
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
    background: var(--colors-bg);
  }
</style>
