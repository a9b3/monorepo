<script lang="ts">
  import { navigate } from 'svelte-routing'
  import moment from 'moment'

  import type { ProjectDoc } from 'src/db'
  import { ContextMenu, Text } from 'src/components'
  import {
    editorStore,
    deleteProject,
    addOpenedProject,
    removeOpenedProject,
    setInFocusElement,
  } from 'src/store'
  import { objectStyle } from 'src/utils'

  export let project: ProjectDoc

  let contextMenuRef: ContextMenu
</script>

<div
  class="project"
  class:selected={$editorStore.inFocusElement === project.id}
  on:click={() => {
    setInFocusElement(project.id)
  }}
  on:contextmenu|preventDefault={evt => {
    setInFocusElement(project.id)
    contextMenuRef.openMenu(evt)
  }}
  on:dblclick={() => {
    addOpenedProject(project)
    navigate(`/project/${project.id}`, { replace: true })
  }}
>
  <ContextMenu
    bind:this={contextMenuRef}
    menu={[
      {
        label: 'Delete Project',
        onClick: () => {
          deleteProject(project.id)
          removeOpenedProject(project.id)
        },
        type: 'item',
      },
    ]}
  />
  <div
    class="cover"
    style={objectStyle({
      background: project.color,
    })}
  />
  <div class="info">
    <div
      style={objectStyle({
        fontSize: '20px',
      })}
    >
      {project.emoji}
    </div>
    <div>
      <div style={`margin-bottom: 5px; font-weight: bold;`}>
        {project.name}
        {$editorStore.openedProjects.findIndex(p => p.id === project.id) > -1
          ? ' (Opened)'
          : ''}
      </div>
      <Text color={'fg2'}>
        {project.controller.bpm} bpm
      </Text>
      <Text color={'fg2'}>
        Last Modified: {moment(project.lastModified).fromNow()}
      </Text>
    </div>
  </div>
</div>

<style>
  .project {
    margin: var(--spacing__padding);
    height: 220px;
    width: 300px;
    border-radius: var(--misc__borderRadius);
    overflow: hidden;
    display: grid;
    grid-template-rows: 70% 30%;
    outline: 1px solid var(--colors__bg2);
  }
  .project.selected {
    outline: 2px solid var(--colors__accent);
  }
  .project:hover {
    background: var(--colors__fg3);
  }

  .cover {
  }

  .info {
    display: flex;
    flex-direction: row;
    background: transparent;
    font-size: 12px;
    align-items: center;
    padding: 20px;
    color: var(--colors__fg);
  }
  .info > * {
    margin-right: 20px;
  }
  .info > *:first-child {
    margin-left: 0;
  }
  .info > *:last-child {
    margin-right: 0;
  }
</style>
