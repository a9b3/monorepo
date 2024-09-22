<script lang="ts">
  import Table from '@renderer/src/components/generic/Table.svelte'
</script>

<div class="main">
  <Table
    data={[
      { name: 'Text', description: 'A block that contains text' },
      { name: 'Page', description: 'A block that contains other blocks' },
      { name: 'Header', description: 'A block that contains a title' },
      { name: 'Code', description: 'A block that contains code' },
      { name: 'List', description: 'A block that contains a list' }
    ]}
    onRowClick={() => {}}
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
