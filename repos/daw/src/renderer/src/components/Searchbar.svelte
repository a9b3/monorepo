<script lang="ts">
  import searchIcon from '../assets/icons/search.svg'
  import Results from './Results.svelte'
  import { noteStore } from '@renderer/src/lib/stores/noteStore'
  import type { Note } from '@ipc/notes'

  let notes: Note[]
  noteStore.subscribe((value) => {
    notes = value.notes
  })

  async function searchNotes(query: string) {
    return await noteStore.searchNotes({ query })
    // The store will be automatically updated with the search
    // results
  }

  let searchQuery = ''

  $: searchQuery, searchNotes(searchQuery)

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
</script>

<form class="main" on:submit={handleSubmit}>
  <img src={searchIcon} alt="Search" width="10rem" height="10rem" />
  <input type="text" placeholder="Search or Create..." bind:value={searchQuery} />
</form>
<Results results={notes} />

<style>
  .main {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 30px;
    color: var(--semantic-colors-surface2);
    background: var(--semantic-colors-background1);
    padding: 0 calc(var(--spacing-s) * 1px);
  }

  input {
    flex-grow: 1;
    border: none;
    outline: none;
    background: none;
    caret-color: var(--semantic-colors-surface2);
    color: var(--semantic-colors-surface2);
    font-family: 'Proggy';
    font-size: 1rem;
  }

  input::placeholder {
    color: var(--semantic-colors-surface2);
  }

  img {
    fill: red;
    margin-right: calc(var(--spacing-xs) * 1px);
  }
</style>
