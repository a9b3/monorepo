<!--
  @component

  Auto save the editor and opened project. This component should be in a {#key}
  directive to ensure it creates a new interval
-->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { editorStore } from 'src/store'
  import { projectDB, editorDB } from 'src/db'
  import { toJSON } from 'src/utils'

  export let autosaveMs = 2000
  export let projectId: string

  $: project = $editorStore.openedProjects.find(proj => {
    return proj.id === projectId
  })

  // auto-save projects every 2 seconds
  let interval: number
  onMount(() => {
    if ($project) {
      projectDB.update($project.id, toJSON($project))
    }
    if ($editorStore.id) {
      editorDB.update($editorStore.id, toJSON($editorStore))
    }

    interval = setInterval(() => {
      if ($project) {
        projectDB.update($project.id, toJSON($project))
      }
      if ($editorStore.id) {
        editorDB.update($editorStore.id, toJSON($editorStore))
      }
    }, autosaveMs)
  })

  onDestroy(() => {
    clearInterval(interval)
  })
</script>
