<script lang="ts">
  import { Searchbar, Layout, DirectoryTree, Text } from 'src/components'
  import { filesStore, selectedDirectory } from 'src/store/files'
  import Finder from './Finder.svelte'

  const sections = [
    { label: 'Collections', rows: $filesStore.collections },
    {
      label: 'Categories',
      rows: $filesStore.categories,
    },
  ]
</script>

<div class="main">
  <div class="searchbar">
    <Searchbar />
  </div>

  <Layout class="content">
    <div class="left">
      <Finder
        {sections}
        selectedId={$filesStore.selectedCategory}
        onSelect={row => {
          $filesStore.selectedCategory =
            $filesStore.selectedCategory === row.id ? undefined : row.id
        }}
      />
    </div>
    <div class="right">
      {#if !$filesStore.selectedCategory}
        <Text color={'bg3'}>No category selected</Text>
      {:else if $selectedDirectory.length === 0}
        <Text color={'bg3'}>Empty</Text>
      {:else}
        <DirectoryTree files={$selectedDirectory} />
      {/if}
    </div>
  </Layout>
</div>

<style>
  .main {
    background-color: var(--colors__bg);
    height: 100%;
    width: 350px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .searchbar {
    padding: var(--spacing__padding);
  }

  .main :global(.content) {
    flex: 1 0 1;
    max-height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: var(--spacing__padding);
    overflow: hidden;
  }
  .left {
    flex: 1.2;
    height: 100%;
    overflow: auto;
  }
  .right {
    flex: 2;
    height: 100%;
    overflow: auto;
  }
</style>
