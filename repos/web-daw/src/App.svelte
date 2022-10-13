<script lang="ts">
  import { onMount } from 'svelte'
  import AppShell from 'src/components/AppShell.svelte'
  import { audioContext } from 'daw/audioContext'

  // Disable default right click behavior because we have our own context menus.
  document.addEventListener('contextmenu', event => event.preventDefault())

  // Need to resume audiocontext to allow playback
  onMount(() => {
    const initmousemove = () => {
      audioContext.resume()
      document.removeEventListener('mousedown', initmousemove)
    }
    document.addEventListener('mousedown', initmousemove)
  })
</script>

<AppShell />

<style>
</style>
