<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { noteStore } from '@renderer/src/stores/noteStore'
  import shortcutManager from '@renderer/src/stores/shortcutManager'
  import Table from '@renderer/src/components/generic/Table.svelte'
  import moment from 'moment'

  export let results: any = []

  onMount(() => {
    $shortcutManager.manager.register({
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
    $shortcutManager.manager.pushActiveContext('results')
  })

  onDestroy(() => {
    $shortcutManager.manager.popActiveContext('results')
  })
</script>

<div class="main">
  <Table
    data={results.map((note) => ({
      id: note.id,
      title: note.title,
      body: note.body,
      // using moment to format the date to relative time
      // lastModified: note.lastModified
      lastModified: moment(note.lastModified, 'YYYY-MM-DD h:mm:ss').fromNow()
      // lastModified: note.lastModified
    }))}
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
