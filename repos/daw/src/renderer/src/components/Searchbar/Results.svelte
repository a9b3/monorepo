<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import shortcutManager from '@renderer/src/stores/shortcutManager'
  import Table from '@renderer/src/components/generic/Table.svelte'
  import ResizableContainer from '@renderer/src/components/generic/ResizableContainer.svelte'
  import confirmDialogue from '@renderer/src/app/lib/ui/confirmDialogue'
  import moment from 'moment'

  export let results: any = []
  export let onSelectId: (id: string) => void
  export let selectedIds: string[] = []
  export let onNext: () => void
  export let onPrev: () => void
  export let onDelete: () => void

  let teardown = () => {}
  onMount(() => {
    teardown = $shortcutManager.manager.register({
      context: 'results',
      title: 'Results',
      description: 'Results of the search query',
      shortcuts: [
        {
          key: 'meta+j',
          description: 'Next note',
          action: () => {
            onNext()
          }
        },
        {
          key: 'meta+k',
          description: 'Prev note',
          action: () => {
            onPrev()
          }
        },
        {
          key: 'meta+Backspace',
          description: 'Delete note',
          action: () => {
            if (!selectedIds.length) {
              return
            }
            confirmDialogue.show({
              message: 'Are you sure you want to delete this note?',
              onConfirm: () => {
                onDelete()
              },
              onCancel: () => {}
            })
          }
        }
      ]
    })
  })

  onDestroy(() => {
    teardown()
  })
</script>

<ResizableContainer allowedEdges={['bottom']}>
  <div class="main">
    <Table
      data={results.map((block) => ({
        id: block.id,
        title: block.properties.title,
        lastModified: moment(block.lastModified).local().fromNow()
      }))}
      onRowClick={(row) => onSelectId(row.id)}
      highlightRows={selectedIds}
      columns={[
        {
          field: 'title',
          header: 'Title',
          cellProps: { style: 'font-weight: 800;' },
        },
        { field: 'lastModified', header: 'Last Modified' },
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
