<script lang="ts">
  import { Route } from 'svelte-routing'
  import { onMount } from 'svelte'
  import ContextMenu from 'src/components/ContextMenu.svelte'
  import {
    filteredProjects,
    createProject,
    fetchProjects,
  } from 'src/store/project'
  import { randomLinearGradient } from 'src/utils/randomLinearGradient'
  import { randomEmoji } from 'src/utils/randomEmoji'
  import ProjectCard from 'src/pages/Dashboard/ProjectCard.svelte'

  let contextMenuRef: ContextMenu

  onMount(() => {
    console.log(`mounted`)
    fetchProjects()
  })
</script>

<div
  class="content"
  on:contextmenu|preventDefault={contextMenuRef.handleRightClick}
>
  <ContextMenu
    bind:this={contextMenuRef}
    menu={[
      {
        label: 'Create Project',
        onClick: () => {
          createProject({
            createdBy: 'string',
            name: 'Untitled',
            bpm: 120,
            timeSignature: { top: 4, bottom: 4 },
            tracks: {},
            trackOrder: [],
            emoji: randomEmoji(),
            color: randomLinearGradient(),
          })
        },
        type: 'item',
      },
    ]}
  />
  <div class="projects">
    {#each $filteredProjects as project}
      <ProjectCard {project} />
    {/each}
  </div>
</div>

<style>
  .content {
    grid-area: main;
    padding: var(--spacing__padding);
    overflow: auto;
  }
  .projects {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
</style>
