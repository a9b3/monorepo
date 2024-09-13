<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { noteStore } from '@renderer/src/stores/noteStore'
  import GenericTable from './GenericTable.svelte'
  import shortcutManager from '@renderer/src/state/shortcutManager'

  export let results: any = []

  onMount(() => {
    shortcutManager.register({
      context: 'results',
      title: 'Results',
      description: 'Results of the search query',
      shortcuts: [
        {
          key: 'meta+j',
          description: 'Next note',
          action: () => {
            noteStore.nextNote()
          }
        },
        {
          key: 'meta+k',
          description: 'Prev note',
          action: () => {
            noteStore.prevNote()
          }
        }
      ]
    })
    shortcutManager.pushActiveContext('results')
  })

  onDestroy(() => {
    shortcutManager.popActiveContext('results')
  })
</script>

<div class="main">
  <GenericTable
    data={results}
    onRowClick={(row) => noteStore.setSelectedNoteId(row.id)}
    highlightRows={[$noteStore.selectedNoteId]}
    columns={[
      { field: 'title', header: 'Title' },
      { field: 'body', header: 'Body', cellProps: { style: 'color: rgba(0,0,0,.4);' } },
      { field: 'lastModified', header: 'Last Modified' }
    ]}
  />
</div>

<style>
  .main {
    background: var(--colors-bg);
    width: 100%;
    height: 120px;
    max-height: 120px;
    border-bottom: var(--border);
  }
</style>
