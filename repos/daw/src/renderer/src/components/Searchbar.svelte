<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte'
  import shortcutManager from '@renderer/src/stores/shortcutManager'
  import searchIcon from '../assets/icons/search.svg?raw'
  import Results from './Results.svelte'
  import blockApi from '@renderer/src/app/db/block'
  import type { Block } from '@renderer/src/app/types/block'

  let inputEl = null
  let results: Block[] = []
  let selectedIds: string[] = []

  export let onBlockChange: (block?: Block) => void
  export let onSubmit: () => void | undefined

  // if there is an exact title match then select it, otherwise create a new
  // note with the search query as the title
  async function handleSubmit(e: Event) {
    e.preventDefault()

    const searchQuery = e.target['0'].value

    let getBlockOpts = searchQuery
      ? { filterBy: [{ field: 'properties.title', value: searchQuery }] }
      : {}
    results = await blockApi.getAllBlocks(getBlockOpts)

    if (results.length === 0) {
      await blockApi.createBlock({
        parent: null,
        type: 'page',
        properties: { title: searchQuery },
        children: []
      })
      results = await blockApi.getAllBlocks(getBlockOpts)
      onBlockChange(results[0])
    }
    await tick()
    onSubmit()
  }

  async function handleInput(e: Event) {
    const searchQuery = e.target.value
    results = searchQuery
      ? await blockApi.searchBlocks({ query: searchQuery })
      : await blockApi.getAllBlocks()
    onBlockChange()
    selectedIds = []
  }

  onMount(async () => {
    results = await blockApi.getAllBlocks()
    $shortcutManager.manager.register({
      context: 'search',
      title: 'Search',
      description: '',
      shortcuts: [
        {
          key: 'meta+l',
          action: () => {
            inputEl.focus()
          }
        }
      ]
    })
    $shortcutManager.manager.pushActiveContext('search')
  })

  onDestroy(() => {
    $shortcutManager.manager.popActiveContext('search')
  })
</script>

<form class="main" on:submit={handleSubmit}>
  <div class="icon-wrapper">
    {@html searchIcon}
  </div>
  <input
    type="text"
    placeholder="Search or Create..."
    bind:this={inputEl}
    on:focus={() => inputEl.select()}
    on:input={handleInput}
  />
</form>

<Results
  {results}
  onNext={() => {
    const idx = results.findIndex((block) => block.id === selectedIds[0])
    if (idx < results.length - 1) {
      selectedIds = [results[idx + 1].id]
      onBlockChange(results[idx + 1])
    }
  }}
  onPrev={() => {
    const idx = results.findIndex((block) => block.id === selectedIds[0])
    if (idx > 0) {
      selectedIds = [results[idx - 1].id]
      onBlockChange(results[idx - 1])
    }
  }}
  onDelete={async () => {
    await blockApi.deleteBlock(selectedIds[0])
    results = await blockApi.getAllBlocks()
    onBlockChange()
    selectedIds = []
  }}
  onSelectId={(id) => {
    selectedIds = [id]
    onBlockChange(results.find((block) => block.id === id))
  }}
  {selectedIds}
/>

<style>
  .main {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    color: var(--colors-fg2);
    background: var(--colors-bg);
    padding: var(--spacing-xxs) var(--spacing-xs);
    border-bottom: var(--border);
  }
  .main:focus-within {
    /* box-shadow: inset 0 0 0 2px var(--colors-fg2); */
  }

  input {
    flex-grow: 1;
    border: none;
    outline: none;
    background: none;
    caret-color: var(--colors-fg2);
    color: var(--colors-fg2);
    font-family: var(--font-family);
    font-size: var(--base-font-size);
  }

  input::placeholder {
    font-size: var(--base-font-size);
    color: var(--colors-fg3);
  }

  .icon-wrapper {
    padding-top: calc(var(--spacing-xs) / 4);
    margin-right: 4px;
  }

  .icon-wrapper :global(svg path) {
    fill: black;
    fill-opacity: 1;
  }

  .icon-wrapper :global(svg) {
    width: var(--spacing-xs);
    height: var(--spacing-xs);
  }
</style>
