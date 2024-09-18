<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { noteStore } from '@renderer/src/stores/noteStore'
  import shortcutManager from '@renderer/src/stores/shortcutManager'
  import Table from '@renderer/src/components/generic/Table.svelte'
  import ResizableContainer from '@renderer/src/components/generic/ResizableContainer.svelte'
  import moment from 'moment'

  export let results: any = []
  export let onSelectedNoteIdChange: (id: string) => void

  function extractTextFromCustomMarkup(markup: string): string {
    // Remove <div> and </div> tags
    let text = markup.replace(/<\/?div>/g, '\n')

    // Remove <br> tags
    text = text.replace(/<br>/g, '\n')

    // Remove any remaining HTML-like tags
    text = text.replace(/<[^>]*>/g, '')

    // Replace multiple newlines with a single newline
    text = text.replace(/\n+/g, '\n')

    // Remove any remaining HTML-like tags
    text = text.replace(/<[^>]*>/g, '')

    // Replace multiple spaces with a single space
    text = text.replace(/\s+/g, ' ')

    text = text.replace('&nbsp;', ' ')

    // Trim leading and trailing whitespace
    return text.trim()
  }

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
            onSelectedNoteIdChange($noteStore.selectedNoteId)
          }
        },
        {
          key: 'meta+k',
          description: 'Prev note',
          action: () => {
            noteStore.prevNote()
            onSelectedNoteIdChange($noteStore.selectedNoteId)
          }
        },
        {
          key: 'meta+Backspace',
          description: 'Delete note',
          action: () => {
            if ($noteStore.selectedNoteId) {
              noteStore.deleteNote({ id: $noteStore.selectedNoteId })
            }
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

<ResizableContainer allowedEdges={['bottom']}>
  <div class="main">
    <Table
      data={results.map((note) => ({
        id: note.id,
        title: note.title,
        body: extractTextFromCustomMarkup(note.body),
        lastModified: moment(note.lastModified, 'YYYY-MM-DD h:mm:ss').fromNow()
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
</ResizableContainer>

<style>
  .main {
    background: var(--colors-bg);
    width: 100%;
    height: 100%;
    border-bottom: var(--border);
  }
</style>
