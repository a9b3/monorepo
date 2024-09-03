<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { noteStore } from '@renderer/src/lib/stores/noteStore'
  import TitleBar from './components/TitleBar.svelte'
  import Searchbar from './components/Searchbar.svelte'
  import TextBox from './components/TextBox.svelte'

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
            api.setSelectedNoteId(state.notes[nextIndex].id)
          } else if (state.notes.length > 0) {
            api.setSelectedNoteId(state.notes[0].id)
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
  setup()

  onMount(() => {
    noteStore.subscribe((state) => {
      console.log(`state: ${JSON.stringify(state)}`)
    })
  })
</script>

<main>
  <TitleBar />
  <Searchbar />
  <TextBox />
</main>

<style>
  main {
    display: grid;
    grid-template-rows: auto auto 200px 1fr;
    height: 100vh;
    width: 100vw;
    gap: calc(var(--spacing-s) * 1px);
    user-select: none;
    padding: 10px;
  }
</style>
