<script lang="ts">
  import AppShell from 'src/components/AppShell.svelte'

  // Disable default right click behavior because we have our own context menus.
  document.addEventListener('contextmenu', event => event.preventDefault())
</script>

<AppShell />

<style>
</style>
