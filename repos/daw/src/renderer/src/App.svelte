<script lang="ts">
  import TitleBar from './components/TitleBar.svelte'
  import Searchbar from './components/Searchbar.svelte'
  import TextBox from './components/TextBox.svelte'
  import CSSVariables from './components/CSSVariables/CSSVariables.svelte'
  import ShortcutLegend from './components/ShortcutLegend.svelte'
  import EditorContainer from './components/EditorContainer.svelte'
</script>

<main>
  <TitleBar></TitleBar>
  <EditorContainer></EditorContainer>
  <CSSVariables />
  <ShortcutLegend />
</main>

<style>
  main {
    /* display: flex; */
    /* flex-direction: column; */
    height: 100vh;
    width: 100vw;
    user-select: none;
    background: var(--colors-bg);
    border: var(--border);
    border-radius: 10px;
  }
</style>
