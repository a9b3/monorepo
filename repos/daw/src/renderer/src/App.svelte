<script lang="ts">
  import TitleBar from './components/TitleBar.svelte'
  import Searchbar from './components/Searchbar.svelte'
  import Results from './components/Results.svelte'
  import TextBox from './components/TextBox.svelte'

  window.api.note.searchNotes({ query: 'hi' }).then(console.log)
</script>

<main>
  <TitleBar />
  <Searchbar />
  <Results />
  <TextBox />
</main>

<style>
  main {
    display: grid;
    grid-template-rows: auto 200px 1fr;
    height: 100vh;
    width: 100vw;
    gap: calc(var(--spacing-s) * 1px);
  }
</style>
