<script lang="ts">
  import type { ProjectDoc } from 'src/database/project'
  import moment from 'moment'
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
      <div style={`margin-bottom: 10px; font-weight: bold;`}>
        {project.name}
        {$editorStore.openedProjects.findIndex(p => p.id === project.id) > -1
          ? ' (Opened)'
          : ''}
      </div>
      <div>
        {project.bpm} bpm
      </div>
      <div>
        Last Modified: {moment(project.lastModified).fromNow()}
      </div>
    </div>
  </div>
</div>

<style>
  .project {
    margin: var(--spacing__padding);
    height: 200px;
    width: 300px;
    border-radius: var(--misc__borderRadius);
    overflow: hidden;
    display: grid;
    grid-template-rows: 2fr 1fr;
    outline: 1px solid var(--colors__bg);
  }
  .project.selected {
    outline: 2px solid var(--colors__accent);
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
    background: var(--colors__fg);
    color: var(--colors__bg);
  }
  .info > * {
    margin-right: 20px;
  }
  .info > *:last-child {
    margin-right: 0;
  }
</style>
