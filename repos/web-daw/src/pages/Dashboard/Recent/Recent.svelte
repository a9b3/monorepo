<script lang="ts">
  import { onMount } from 'svelte'
  import { navigate } from 'svelte-routing'
  import { Icon, ContextMenuGroup } from 'src/components'
  import {
    addOpenedProject,
    createProject,
    dashboardStore,
    fetchProjects,
    filteredProjects,
    userStore,
    projectFetching,
  } from 'src/store'
  import { objectStyle, randomEmoji, randomLinearGradient } from 'src/utils'
  import { DANGEROUSLY_RESET_EVERYTHING } from 'src/utils/debug'
  import { editorDB, projectDB, userDB } from 'src/db'
  import ProjectCard from './ProjectCard.svelte'
  import ProjectRow from './ProjectRow.svelte'
  import FilterSort from './FilterSort.svelte'

  export let location: any

  let showApp = true

  onMount(() => {
    fetchProjects()
  })

  async function resetAllDbs() {
    showApp = false
    await DANGEROUSLY_RESET_EVERYTHING()
    showApp = true
  }

  async function handleCreateProject() {
    const proj = await createProject({
      createdBy: $userStore.id,
      name: 'Untitled',
      tracks: [],
      emoji: randomEmoji(),
      color: randomLinearGradient(),
      controller: {
        bpm: 120,
      },
    })
    addOpenedProject(proj)
    navigate(`/project/${proj.id}`, { replace: true })
  }
</script>

{#if showApp}
  <div class="content">
    {#if !$projectFetching}
      <ContextMenuGroup
        menu={{
          items: [
            {
              label: 'WHATSUP',
              handler: () => {},
              type: 'item',
            },
            {
              label: 'EXCLUSIVE',
              handler: () => {},
              type: 'item',
              exclusive: true,
            },
          ],
        }}
      />
      <div class="actions">
        <div class="card" on:click={handleCreateProject}>
          Create New Project
          <div
            style={objectStyle({
              marginLeft: 'auto',
              fontSize: '16px',
            })}
          >
            <Icon type={'addLine'} />
          </div>
        </div>
        <div class="card" on:click={resetAllDbs}>
          RESET EVERYTHING
          <div
            style={objectStyle({
              marginLeft: 'auto',
              fontSize: '16px',
            })}
          >
            <Icon type={'addLine'} />
          </div>
        </div>
      </div>
      <div class="filter">
        <FilterSort />
      </div>
      <div class="projects">
        {#each $filteredProjects as project}
          {#if $dashboardStore.selectedView === 'grid'}
            <ProjectCard {project} />
          {/if}
          {#if $dashboardStore.selectedView === 'line'}
            <ProjectRow {project} />
          {/if}
        {/each}
      </div>
    {/if}
  </div>
{/if}

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

  .actions {
    display: flex;
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
