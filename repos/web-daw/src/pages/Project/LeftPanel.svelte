<script lang="ts">
  import Searchbar from 'src/components/Searchbar.svelte'
  import Layout from 'src/components/Layout.svelte'
  import DirectoryTree from 'src/components/DirectoryTree.svelte'
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
    <div class="right"><DirectoryTree files={$selectedDirectory} /></div>
  </Layout>
</div>

<style>
  .main {
    background-color: var(--colors__bg);
    height: 100%;
    width: 350px;
  }

  .searchbar {
    padding: var(--spacing__padding);
  }

  .main :global(.content) {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: var(--spacing__padding);
  }
  .left {
    flex: 1.2;
  }
  .right {
    flex: 2;
  }
</style>
