<script lang="ts">
  import Icon from 'src/components/Icon.svelte'
  import { randomEmoji } from 'src/utils/randomEmoji'
  import { Link, navigate } from 'svelte-routing'
  import ClearEditableText from 'src/components/ClearEditableText.svelte'
  import type { Project } from 'src/daw/Project'
  import editorStore, {
    setSelectedProject,
    removeOpenedProject,
  } from 'src/store/editor'

  export let project: Project
</script>

<Link
  to={`/project/${$project.id}`}
  on:click={() => {
    setSelectedProject($project.id)
  }}
>
  <div
    class="tab project"
    class:selected={$editorStore.selectedProjectId === $project.id}
  >
    {randomEmoji()}
    <div style={`width: 15px;`} />

    <ClearEditableText
      foo={$project.name}
      handleInput={evt => {
        $project.setName(evt.target.value)
      }}
    />

    {$project.name}
    <div
      class="tabEnd"
      on:click|stopPropagation|preventDefault={() => {
        const nextId = removeOpenedProject($project.id)
        if (nextId) {
          navigate(`/project/${nextId}`, { replace: true })
        } else {
          navigate(`/`, { replace: true })
        }
      }}
    >
      <Icon type="closeLine" />
    </div>
  </div>
</Link>

<style>
  .tab {
    padding: 0 var(--spacing__padding);
    height: 100%;
    display: flex;
    align-items: center;
    border-right: 1px solid var(--colors__bg);
  }
  .tab:hover {
    filter: brightness(0.8);
  }

  .tab.selected {
    background: var(--colors__bg);
  }
  .tab.selected:hover {
    background: var(--colors__bg);
    filter: none;
  }

  .tab.project {
    width: 280px;
  }

  .tabEnd {
    margin-left: auto;
  }
</style>
