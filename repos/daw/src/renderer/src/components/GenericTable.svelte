<script lang="ts">
  export let data = []
  export let columns = []
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
    background-color: #ddd;
    border: 1px solid #ddd;
  }

  .grid-table-header,
  .grid-table-cell {
    padding: 0 4px;
    background-color: #fff;
  }

  .grid-table-header {
    font-weight: bold;
    background-color: #f0f0f0;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .grid-table-cell:nth-child(even) {
    background-color: #f9f9f9;
  }
</style>
