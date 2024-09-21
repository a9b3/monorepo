<script lang="ts">
  import { onMount } from 'svelte'
  import TitleBar from './components/TitleBar.svelte'
  import CSSVariables from './components/CSSVariables/CSSVariables.svelte'
  import ShortcutLegend from './components/ShortcutLegend.svelte'
  import EditorContainer from './components/EditorContainer.svelte'
  import { initDatabase } from './app/db/init'
  import blockDb from './app/db/block'

  let appRdy = false

  onMount(async () => {
    await initDatabase()
    appRdy = true
    // await blockDb.createBlock({
    //   id: '123',
    //   parent: null,
    //   type: 'page',
    //   properties: {
    //     title: 'My First Note'
    //   },
    //   children: [
    //     {
    //       id: '456',
    //       parent: '123',
    //       type: 'header',
    //       properties: {
    //         level: 1
    //       },
    //       children: [
    //         {
    //           id: '789',
    //           parent: '456',
    //           type: 'text',
    //           properties: {
    //             text: 'Hello, World!'
    //           },
    //           children: [],
    //           lastModified: '2021-09-01T00:00:00.000Z'
    //         }
    //       ],
    //       lastModified: '2021-09-01T00:00:00.000Z'
    //     }
    //   ],
    //   lastModified: '2021-09-01T00:00:00.000Z'
    // })
    const blocks = await blockDb.getAllBlocks({
      filterBy: [{ field: 'properties.title', value: 'My First Note' }]
    })
    console.log(blocks)
  })
</script>

<main>
  {#if appRdy}
    <TitleBar></TitleBar>
    <EditorContainer></EditorContainer>
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
