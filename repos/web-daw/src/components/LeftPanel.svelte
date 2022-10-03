<script lang="ts">
  import Searchbar from 'src/components/Searchbar.svelte'
  import Layout from 'src/components/Layout.svelte'
  import Finder from 'src/components/Finder.svelte'
  import DirectoryTree from 'src/components/DirectoryTree.svelte'
</script>

<div class="main">
  <div class="searchbar">
    <Searchbar />
  </div>

  <Layout class="content">
    <div class="left">
      <Finder />
    </div>
    <div class="right"><DirectoryTree /></div>
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
    flex: 1;
  }
  .right {
    flex: 2;
  }
</style>
