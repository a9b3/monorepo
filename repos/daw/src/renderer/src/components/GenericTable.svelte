<script lang="ts">
  export let data = []
  export let columns: {
    field: string
    header: string
    cellRenderer?: any
    passProps?: (row: any) => any
  }[] = []
  export let tableHeight = '300px'
  export let tableWidth = '100%'
</script>

<div
  class="table-container"
  style="max-height: {tableHeight}; width:
{tableWidth}; --column-count: {columns.length}"
>
  <div class="grid-table">
    {#each columns as column}
      <div class="grid-table-header">{column.header}</div>
    {/each}

    {#each data as row}
      {#each columns as column}
        <div class="grid-table-cell">
          {#if column.cellRenderer}
            <svelte:component this={column.cellRenderer} {...column.passProps(row)} />
          {:else}
            {row[column.field]}
          {/if}
        </div>
      {/each}
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
    gap: 1px;
    border: 1px solid black;
  }

  .grid-table-header,
  .grid-table-cell {
    padding: 0 4px;
  }

  .grid-table-header {
    font-weight: bold;
    position: sticky;
    top: 0;
    z-index: 1;
    border-bottom: 1px solid black;
  }

  .grid-table-cell:nth-child(even) {
  }
</style>
