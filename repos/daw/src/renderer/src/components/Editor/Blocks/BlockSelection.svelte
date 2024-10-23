<script lang="ts">
  import shortcutManager from '@renderer/src/stores/shortcutManager'
  import Table from '@renderer/src/components/generic/Table.svelte'

  export let onSelection: (type: string, properties?: Object) => void
  export let onClose: () => void

  let data = [
    {
      id: 'header',
      name: 'Header',
      properties: { level: 5, text: '' },
      description: 'Header text',
    },
    {
      id: 'code',
      name: 'Code',
      properties: {
        text: '',
        language: '',
      },
      description: 'Display code with syntax highlighting',
    },
    {
      id: 'listItem',
      name: 'Bullet List Item',
      properties: {
        text: '',
        listType: 'bullet',
        indentLevel: 0,
      },
      description: 'Bullet list item',
    },
    {
      id: 'url',
      name: 'URL',
      properties: {
        text: '',
        href: '',
      },
      description: 'Hyperlink to a URL',
    },
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
</script>

<div
  class="main"
  use:shortcutManager.setContext={{
    context: 'blockSelection',
    title: 'Block Selection',
    description: 'Block selection for the application',
    shortcuts: [
      {
        key: ['meta+j', 'ArrowDown'],
        title: 'Next Block',
        description: 'Select the next block type',
        action: nextBlock,
        preventDefault: true,
        stopPropagation: true,
      },
      {
        key: ['meta+k', 'ArrowUp'],
        title: 'Previous Block',
        description: 'Select the previous block type',
        action: prevBlock,
        preventDefault: true,
        stopPropagation: true,
      },
      {
        key: 'Enter',
        title: 'Select Block',
        description: 'Select the block type',
        action: selectBlock,
        preventDefault: true,
        stopPropagation: true,
      },
      {
        key: ['Escape', 'Backspace'],
        title: 'Close',
        description: 'Close the block selection',
        action: () => {
          onClose()
        },
      },
    ],
  }}
>
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
      { field: 'description', header: 'Description' },
    ]}
  />
</div>

<style>
  .main {
    width: 300px;
    background: var(--colors-bg);
  }
</style>
