<!--
  @component

  Auto save the editor and opened project.
-->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { editorStore } from 'src/store'
  import { projectDb, editorDb } from 'src/db'
  import { instanceToJson } from 'src/utils'

  export let autosaveMs = 2000
  export let id: string

  $: project = $editorStore.openedProjects.find(proj => {
    return proj.id === id
  })

  // auto-save projects every 2 seconds
  let interval: number
  onMount(() => {
    // TODO REMOVE, super hack until database stablizes
    if (window.location.host === 'lllllllll.link"') {
      return
    }
    // onMount save
    if ($project) {
      projectDb.update($project.id, instanceToJson($project))
    }
    if ($editorStore.id) {
      editorDb.update($editorStore.id, instanceToJson($editorStore))
    }

    interval = setInterval(() => {
      if ($project) {
        projectDb.update($project.id, instanceToJson($project))
      }
      if ($editorStore.id) {
        editorDb.update($editorStore.id, instanceToJson($editorStore))
      }
    }, autosaveMs)
  })

  onDestroy(() => {
    clearInterval(interval)
  })
</script>
