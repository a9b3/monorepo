<script lang="ts">
  import type { ProjectDoc } from 'src/database/project'
  import ContextMenu from 'src/components/ContextMenu.svelte'
  import { deleteProject } from 'src/store/project'
  import { navigate } from 'svelte-routing'
  import localStore, {
    addOpenedProject,
    removeOpenedProject,
    setSelectedProject,
    setInFocusElement,
  } from 'src/store/editor'
  import { randomLinearGradient } from 'src/utils/randomLinearGradient'
  import { randomEmoji } from 'src/utils/randomEmoji'
  import { objectStyle } from 'src/utils/objectToStyleStr'
  export let project: ProjectDoc

  let randomGradient = `background: ${randomLinearGradient()};`
  let contextMenuRef: ContextMenu
</script>

<div
  class="project"
  class:selected={$localStore.inFocusElement === project.id}
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
  <div class="cover" style={randomGradient} />
  <div class="info">
    <div
      style={objectStyle({
        fontSize: '20px',
      })}
    >
      {randomEmoji()}
    </div>
    <div>
      <div style={`margin-bottom: 10px; font-weight: bold;`}>
        {project.name}
      </div>
      <div>
        {project.bpm} bpm
      </div>
    </div>
  </div>
</div>

<style>
  .project {
    margin: var(--spacing__padding);
    height: 200px;
    width: 300px;
    border-radius: 4px;
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
  }
  .info > * {
    margin-right: 20px;
  }
  .info > *:last-child {
    margin-right: 0;
  }
</style>
