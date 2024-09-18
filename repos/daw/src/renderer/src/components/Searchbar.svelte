<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte'
  import { noteStore } from '@renderer/src/stores/noteStore'
  import shortcutManager from '@renderer/src/stores/shortcutManager'
  import searchIcon from '../assets/icons/search.svg?raw'
  import Results from './Results.svelte'

  let inputEl = null
  export let onSubmit: () => void | undefined

  // if there is an exact title match then select it, otherwise create a new
  // note with the search query as the title
  async function handleSubmit(e: Event) {
    e.preventDefault()

    const searchQuery = e.target['0'].value

    const res = await noteStore.searchNotes(searchQuery)
    if (res.find((note) => note.title === searchQuery)) {
      noteStore.setSelectedNoteId(res.find((note) => note.title === searchQuery).id)
    } else {
      const createdNote = await noteStore.upsertNote({
        title: searchQuery,
        body: ''
      })
      await noteStore.searchNotes({ query: searchQuery, resetState: true })
      noteStore.setSelectedNoteId(createdNote.id)
    }

    await tick()
    onSubmit()
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
    bind:this={inputEl}
    on:focus={() => inputEl.select()}
    on:input={(e) => noteStore.searchNotes({ query: e.target.value, resetState: true })}
  />
</form>

<Results
  results={$noteStore.notes}
  onSelectedNoteIdChange={(id) => {
    inputEl.value = $noteStore.notes.find((note) => note.id === id)?.title || ''
    inputEl.select()
  }}
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
