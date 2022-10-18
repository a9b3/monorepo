<script lang="ts">
  import { onMount } from 'svelte'
  import { audioContext } from 'daw/audioContext'
  import AppShell from 'src/components/AppShell.svelte'

  // Disable default right click behavior
  document.addEventListener('contextmenu', event => event.preventDefault())

  const initmousemove = () => {
    audioContext.resume()
    document.removeEventListener('mousedown', initmousemove)
  }

  // Need to resume audiocontext to allow playback
  onMount(() => {
    document.addEventListener('mousedown', initmousemove)
  })
</script>

<AppShell />

<style>
</style>
