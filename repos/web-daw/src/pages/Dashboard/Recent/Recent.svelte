<script lang="ts">
  import { onMount } from 'svelte'
  import { Icon } from 'src/components'
  import ContextMenu from 'src/components/ContextMenu.svelte'
  import {
    filteredProjects,
    createProject,
    fetchProjects,
  } from 'src/store/project'
  import { randomLinearGradient } from 'src/utils/randomLinearGradient'
  import { randomEmoji } from 'src/utils/randomEmoji'
  import ProjectCard from 'src/pages/Dashboard/ProjectCard.svelte'
  import FilterSort from './FilterSort.svelte'
  import { objectStyle } from 'src/utils/objectToStyleStr'

  let contextMenuRef: ContextMenu

  onMount(() => {
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
  <div class="actions">
    <div class="card">
      Create New Project
      <div
        style={objectStyle({
          marginLeft: 'auto',
        })}
      >
        <Icon type={'closeLine'} />
      </div>
    </div>
  </div>
  <div class="filter">
    <FilterSort />
  </div>
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
    height: 100%;
  }
  .filter {
    padding: 10px;
  }
  .projects {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .card {
    padding: 20px;
    border: 1px solid var(--colors__bg2);
    border-radius: 4px;
    width: 300px;
    margin: 10px;
    height: 60px;
    margin-bottom: 30px;
    display: flex;
    align-items: center;
  }
  .card:hover {
    background-color: var(--colors__fg3);
  }
</style>
