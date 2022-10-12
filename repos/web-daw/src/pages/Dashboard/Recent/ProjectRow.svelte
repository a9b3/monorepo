<script lang="ts">
  import { navigate } from 'svelte-routing'
  import moment from 'moment'

  import type { ProjectDoc } from 'src/db'
  import { Text, ContextMenu } from 'src/components'
  import {
    addOpenedProject,
    deleteProject,
    editorStore,
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
    contextMenuRef.handleRightClick(evt)
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
  <div class="info">
    <div
      style={objectStyle({
        fontSize: '20px',
        width: '30px',
      })}
    >
      {project.emoji}
    </div>
    <div class="row">
      <div style={`font-weight: bold;`}>
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
    margin: var(--spacing__paddingM);
    width: 100%;
    border-radius: var(--misc__borderRadius);
    overflow: hidden;
    display: grid;
    outline: 1px solid var(--colors__bg2);
  }
  .project.selected {
    outline: 2px solid var(--colors__accent);
  }
  .project:hover {
    background-color: var(--colors__fg3);
  }

  .row {
    display: grid;
    grid-template-columns: 250px 100px 1fr;
  }

  .info {
    display: flex;
    flex-direction: row;
    background: transparent;
    font-size: 12px;
    align-items: center;
    padding: 10px;
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
