<script lang="ts">
  import type { ProjectDoc } from 'src/database/project'
  import { Text } from 'src/components'
  import ContextMenu from 'src/components/ContextMenu.svelte'
  import { deleteProject } from 'src/store/project'
  import { navigate } from 'svelte-routing'
  import editorStore, {
    addOpenedProject,
    removeOpenedProject,
    setSelectedProject,
    setInFocusElement,
  } from 'src/store/editor'
  import { objectStyle } from 'src/utils/objectToStyleStr'
  import moment from 'moment'

  export let project: ProjectDoc

  let contextMenuRef: ContextMenu
</script>

<div
  class="project"
  class:selected={$editorStore.inFocusElement === project.id}
  on:click={() => {
    setInFocusElement(project.id)
  }}
  on:contextmenu|preventDefault={contextMenuRef.handleRightClick}
  on:dblclick={() => {
    addOpenedProject(project)
    setSelectedProject(project.id)
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
        {project.bpm} bpm
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
    background: var(--colors__bg3);
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
