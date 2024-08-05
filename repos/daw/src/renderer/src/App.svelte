<script lang="ts">
  import TitleBar from './components/TitleBar.svelte'
  import Searchbar from './components/Searchbar.svelte'
  import TextBox from './components/TextBox.svelte'
</script>

<main>
  <TitleBar />
  <Searchbar />
  <TextBox />
</main>

<style>
  main {
    display: grid;
    grid-template-rows: auto auto 200px 1fr;
    height: 100vh;
    width: 100vw;
    gap: calc(var(--spacing-s) * 1px);
  }
</style>
