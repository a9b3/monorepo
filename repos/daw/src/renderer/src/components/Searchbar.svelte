<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import searchIcon from '../assets/icons/search.svg?raw'
  import Results from './Results.svelte'
  import { noteStore } from '@renderer/src/stores/noteStore'
  import shortcutManager from '@renderer/src/stores/shortcutManager'

  let inputEl = null
  let searchQuery = ''

  function searchNotes(query: string) {
    return noteStore.searchNotes({ query })
  }

  $: {
    searchNotes(searchQuery)
  }

  async function handleSubmit(e: Event) {
    e.preventDefault()

    const res = await searchNotes(searchQuery)
    if (res.length === 0) {
      await noteStore.upsertNote({
        title: searchQuery,
        body: ''
      })
      await searchNotes(searchQuery)
    } else {
      alert('Note already exists')
    }
  }

  onMount(() => {
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
    bind:value={searchQuery}
    bind:this={inputEl}
  />
</form>

<Results results={$noteStore.notes} />

<style>
  .main {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    color: var(--colors-fg2);
    background: var(--colors-bg);
    padding: 0px var(--spacing-xs);
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
    color: var(--colors-fg3);
  }

  .icon-wrapper {
    padding-top: 2px;
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
