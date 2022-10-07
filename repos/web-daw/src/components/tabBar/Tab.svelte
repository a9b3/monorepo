<!--
  @component

  An individual tab used by TabBar
-->
<script lang="ts">
  import Icon from 'src/components/Icon.svelte'
  import { Link, navigate } from 'svelte-routing'
  import ClearEditableText from 'src/components/ClearEditableText.svelte'
  import type { Project } from 'src/daw/Project'
  import type { Controller } from 'src/daw/Controller'
  import { setSelectedProject, removeOpenedProject } from 'src/store/editor'
  import { url } from 'src/store/url'

  export let project: Project
  let currentProject: Project
  let currentController: Controller
  $: {
    currentProject = project
    currentController = project.controller
  }

  $: tabUrlPath = `/project/${$currentProject.id}`
</script>

<Link
  to={tabUrlPath}
  on:click={() => {
    setSelectedProject($currentProject.id)
  }}
>
  <div
    class="tab project"
    class:selected={$url.pathname.startsWith(tabUrlPath)}
  >
    {$currentProject.emoji}
    <div style={`width: 15px;`} />

    {#if $currentController.isPlaying}
      <Icon type="play" />
      <div style={`width: 15px;`} />
    {/if}

    <ClearEditableText
      value={$currentProject.name}
      handleInput={evt => {
        $currentProject.setName(evt.target.value)
      }}
    />

    <div
      class="tabEnd"
      on:click|stopPropagation|preventDefault={() => {
        $currentProject.shutdown()
        const nextId = removeOpenedProject($currentProject.id)
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
