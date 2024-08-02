<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import searchIcon from '../assets/icons/search.svg'
  import Results from './Results.svelte'

  let searchQuery = ''
  let res: any

  $: searchQuery, search(searchQuery)

  async function search(q: string) {
    res = await window.api.note.searchNotes({ query: q })
    return res
  }

  async function handleSubmit(e: Event) {
    e.preventDefault()
    const res = await search(searchQuery)
    if (res.length === 0) {
      await window.api.note.upsertNote({ title: searchQuery, body: '' })
      search(searchQuery)
    } else {
      alert('Note already exists')
    }
  }

  // -------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------

  // -------------------------------------------------------------------------
  // Internal
  // -------------------------------------------------------------------------

  onMount(() => {})
  onDestroy(() => {})
</script>

<form class="main" on:submit={handleSubmit}>
  <img src={searchIcon} alt="Search" width="14rem" height="14rem" />
  <input type="text" placeholder="Search or Create..." bind:value={searchQuery} />
</form>
<Results results={res} />

<style>
  .main {
    display: flex;
    align-items: center;
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
    color: var(--semantic-colors-surface1);
  }
</style>
