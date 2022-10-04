<script lang="ts">
  import { onMount } from 'svelte'
  import { objectStyle } from 'src/utils/objectToStyleStr'
  import Icon from 'src/components/Icon.svelte'
  import ContextMenu from 'src/components/ContextMenu.svelte'
  import {
    filteredProjects,
    createProject,
    fetchProjects,
  } from 'src/store/project'
  import ProjectCard from './ProjectCard.svelte'

  let contextMenuRef: ContextMenu

  onMount(() => fetchProjects())
</script>

<div class={($$restProps.class || '') + ' main'} style={$$restProps.style}>
  <div class="left">
    <div class="row">
      <Icon
        type="fileFill"
        style={objectStyle({
          marginRight: '15px',
        })}
      />
      All Projects
    </div>
    <div class="row">Recent</div>
    <div class="row">Drafts</div>
    <div
      style={objectStyle({
        borderBottom: '1px solid var(--colors__bg3)',
        margin: '0 20px',
      })}
    />
    <div class="row">Favorites</div>
    <div
      style={objectStyle({
        borderBottom: '1px solid var(--colors__bg3)',
        margin: '0 20px',
      })}
    />
    <div class="row">Teams</div>
  </div>
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
              createdAt: Date.now(),
              name: 'Untitled',
              bpm: Math.floor(Math.random() * 120),
              timeSignature: { top: Math.floor(Math.random() * 4), bottom: 1 },
              tracks: {},
              trackOrder: [],
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
</div>

<style>
  .main {
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: grid;
    grid-template:
      'left main' 1fr
      / auto 1fr;
    background: var(--colors__bg3);
  }

  .left {
    width: 250px;
    grid-area: left;
    background: var(--colors__bg);
  }
  .content {
    grid-area: main;
    padding: var(--spacing__padding);
    overflow: auto;
  }

  .row {
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 20px;
  }

  .projects {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
</style>
