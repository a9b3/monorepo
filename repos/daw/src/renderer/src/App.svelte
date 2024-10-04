<script lang="ts">
  import { onMount } from 'svelte'
  import TitleBar from './components/TitleBar.svelte'
  import CSSVariables from './components/CSSVariables/CSSVariables.svelte'
  import ShortcutLegend from './components/ShortcutLegend.svelte'
  import MainLayout from './components/MainLayout.svelte'
  import ConfirmDialogue from './components/generic/ConfirmDialogue.svelte'
  import { initDatabase } from './app/db/init'
  import('highlight.js/styles/monokai.css')

  let appRdy = false

  onMount(async () => {
    await initDatabase()
    appRdy = true
  })
</script>

<main>
  {#if appRdy}
    <TitleBar></TitleBar>
    <MainLayout />
  {/if}
</main>
<CSSVariables />
<ShortcutLegend />
<ConfirmDialogue />

<style>
  main {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    user-select: none;
    background: var(--colors-bg);
    border: var(--border);
    border-radius: 10px;
    overflow: hidden;
  }
</style>
