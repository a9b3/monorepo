<script lang="ts">
  import { afterUpdate } from 'svelte'

  export let data: {
    id: string
    name: string
    value: string
  }[] = []
  export let columns: {
    field: string
    header: string
    cellComponent?: any
    headerComponent?: any
    passProps?: (row: any) => any
    cellProps?: any
  }[] = []
  export let onRowClick: (row: any) => void = () => {}
  export let highlightRows: string[] = []
  export let tableHeight = '100%'
  export let tableWidth = '100%'

  let container: HTMLElement

  let lastHlCell: Element
  afterUpdate(() => {
    // scroll to the selected row keeping the selected row in the middle
    const hlCell = container.querySelector('.grid-row.highlight > .grid-table-cell')
    if (hlCell && hlCell !== lastHlCell) {
      lastHlCell = hlCell

      const headerCell = container.querySelector('.grid-table-header')
      if (hlCell) {
        const { top, bottom } = hlCell.getBoundingClientRect()
        const { top: containerTop, bottom: containerBottom } = container.getBoundingClientRect()
        if (top < containerTop) {
          container.scrollTop -= containerTop - top + headerCell.clientHeight
        } else if (bottom > containerBottom) {
          container.scrollTop += bottom - containerBottom + headerCell.clientHeight
        }
      }
    }
  })
</script>

<div
  class="table-container"
  bind:this={container}
  style="max-height: {tableHeight}; width:
{tableWidth}; --column-count: {columns.length}"
>
  <div class="grid-table">
    {#each columns as column}
      <div class="grid-table-header">
        {#if column.headerComponent}
          <svelte:component this={column.headerComponent} value={column.header} />
        {:else}
          {column.header}
        {/if}
      </div>
    {/each}

    {#each data as row}
      <div
        class="grid-row"
        class:highlight={highlightRows.includes(row.id)}
        on:click={() => onRowClick(row)}
      >
        {#each columns as column}
          <div class="grid-table-cell" {...column.cellProps || {}}>
            {#if column.cellComponent}
              <svelte:component this={column.cellComponent} {...column.passProps(row)} />
            {:else}
              {row[column.field]}
            {/if}
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  .table-container {
    overflow-y: auto;
  }

  .grid-table {
    display: grid;
    grid-template-columns: repeat(var(--column-count), 1fr);
    /* gap: 1px; */
  }

  .grid-table-header,
  .grid-table-cell {
    padding: var(--spacing-xxs) var(--spacing-xs);
  }

  .grid-table-cell {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .grid-table-header {
    position: sticky;
    top: 0;
    z-index: 1;
    border-bottom: var(--border);
    background: var(--colors-bg);
  }

  .grid-row {
    display: contents;
  }
  .grid-row.highlight > .grid-table-cell {
    background: var(--colors-hl);
  }
  .grid-row:hover:not(.grid-row.highlight) > .grid-table-cell {
    background: rgba(0, 0, 0, 0.05);
  }

  .grid-table-cell:nth-child(even) {
  }
</style>
