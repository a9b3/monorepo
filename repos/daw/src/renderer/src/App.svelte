<script lang="ts">
  import { onMount } from 'svelte'
  import TitleBar from './components/TitleBar.svelte'
  import CSSVariables from './components/CSSVariables/CSSVariables.svelte'
  import ShortcutLegend from './components/ShortcutLegend.svelte'
  import MainLayout from './components/MainLayout.svelte'
  import { initDatabase } from './app/db/init'

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
    <CSSVariables />
    <ShortcutLegend />
  {/if}
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
