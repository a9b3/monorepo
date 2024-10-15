<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte'
  import shortcutManager from '@renderer/src/stores/shortcutManager'
  import searchIcon from '../../assets/icons/search.svg?raw'
  import Results from './Results.svelte'
  import blockApi from '@renderer/src/app/db/block'
  import type { Page } from '@renderer/src/app/types/block'

  export let onPageChange: (block?: Page) => void
  export let onSubmit: () => void | undefined

  let inputEl = null
  let results: Page[] = []
  let selectedIds: string[] = []
  let queryOpts = {
    sortBy: [{ field: 'lastModified', direction: 'DSC' as 'DSC' }],
  }

  // if there is an exact title match then select it, otherwise create a new
  // note with the search query as the title
  async function handleSubmit(e: Event) {
    e.preventDefault()

    const searchQuery = e.target['0'].value

    let getBlockOpts = {
      ...queryOpts,
      ...(searchQuery ? { filterBy: [{ field: 'properties.title', value: searchQuery }] } : {}),
    }
    results = (await blockApi.getAllBlocks(getBlockOpts)) as Page[]

    if (results.length === 0) {
      await blockApi.createBlock({
        type: 'page',
        properties: { title: searchQuery },
        children: [
          {
            id: window.crypto.randomUUID(),
            type: 'text',
            properties: { text: '' },
            lastModified: new Date().toISOString(),
            children: [],
          },
        ],
      })
      results = (await blockApi.getAllBlocks(getBlockOpts)) as Page[]
      onPageChange(results[0])
    }
    await tick()
    onSubmit()
  }

  async function handleInput(e: Event) {
    const target = e.target as HTMLInputElement
    const searchQuery = target.value
    results = searchQuery
      ? ((await blockApi.searchBlocks({ query: searchQuery })) as Page[])
      : ((await blockApi.getAllBlocks(queryOpts)) as Page[])
    onPageChange()
    selectedIds = []
  }

  onMount(async () => {
    results = (await blockApi.getAllBlocks(queryOpts)) as Page[]
  })
</script>

<form
  class="main"
  on:submit={handleSubmit}
  use:shortcutManager.setContext={{
    context: 'search',
    title: 'Search',
    description: '',
    shortcuts: [
      {
        key: 'meta+l',
        action: () => {
          inputEl.focus()
        },
      },
    ],
  }}
>
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
      onPageChange(results[idx + 1])
    }
  }}
  onPrev={() => {
    const idx = results.findIndex((block) => block.id === selectedIds[0])
    if (idx > 0) {
      selectedIds = [results[idx - 1].id]
      onPageChange(results[idx - 1])
    }
  }}
  onDelete={async () => {
    await blockApi.deleteBlock(selectedIds[0])
    results = await blockApi.getAllBlocks(queryOpts)
    onPageChange()
    selectedIds = []
  }}
  onSelectId={(id) => {
    selectedIds = [id]
    onPageChange(results.find((block) => block.id === id))
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
    padding: 0 var(--spacing-xxs);
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
    fill: var(--colors-fg);
    fill-opacity: 1;
  }

  .icon-wrapper :global(svg) {
    width: var(--spacing-xs);
    height: var(--spacing-xs);
  }
</style>
