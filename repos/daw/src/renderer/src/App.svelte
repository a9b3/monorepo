<script lang="ts">
  import { onMount } from 'svelte'
  import { noteStore } from '@renderer/src/stores/noteStore'
  import TitleBar from './components/TitleBar.svelte'
  import Searchbar from './components/Searchbar.svelte'
  import TextBox from './components/TextBox.svelte'
  import CSSVariables from './components/CSSVariables/CSSVariables.svelte'

  let alreadyAdded = false
  function setup() {
    noteStore.subscribe((state) => {
      console.log(`state: ${JSON.stringify(state)}`)
      if (alreadyAdded) {
        return
      }
      function handler(e: KeyboardEvent) {
        if (e.key === 'j' && e.metaKey) {
          if (state.selectedNote) {
            const selectedIndex = state.notes.findIndex((note) => note.id === state.selectedNote.id)
            const nextIndex = (selectedIndex + 1) % state.notes.length
            noteStore.setSelectedNoteId(state.notes[nextIndex].id)
          } else if (state.notes.length > 0) {
            noteStore.setSelectedNoteId(state.notes[0].id)
          } else {
          }
        }
        if (e.key === 'k' && e.metaKey) {
          alert('Ctrl + K pressed')
        }
      }
      document.removeEventListener('keydown', handler)
      document.addEventListener('keydown', handler)
      alreadyAdded = true
    })
  }

  onMount(() => {
    setup()
    noteStore.subscribe((state) => {
      console.log(`state: ${JSON.stringify(state)}`)
    })
  })
</script>

<main>
  <CSSVariables />
  <TitleBar />
  <Searchbar />
  <TextBox />
  <div class="bottom" />
</main>

<style>
  main {
    display: grid;
    grid-template-rows: auto auto 200px 1fr;
    height: 100vh;
    width: 100vw;
    gap: calc(var(--spacing-xs) * 1px);
    user-select: none;
    background: var(--semantic-colors-background1);
    padding: 2px 0;
  }

  .bottom {
    height: 0px;
  }
</style>
