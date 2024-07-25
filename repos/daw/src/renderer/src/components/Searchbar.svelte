<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import searchIcon from '../assets/icons/search.svg'

  let searchQuery = ''

  // -------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------

  // -------------------------------------------------------------------------
  // Internal
  // -------------------------------------------------------------------------

  onMount(() => {})
  onDestroy(() => {})
</script>

<search class="main">
  <img src={searchIcon} alt="Search" width="14rem" height="14rem" />
  <input type="text" placeholder="Search or Create..." bind:value={searchQuery} />
</search>

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
