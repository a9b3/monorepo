<script lang="ts">
  import Icon from 'src/components/Icon.svelte'
  import { randomEmoji } from 'src/utils/randomEmoji'
  import { Link, navigate } from 'svelte-routing'
  import localStore, {
    setSelectedProject,
    removeOpenedProject,
  } from 'src/store/editor'
</script>

<div class={($$restProps.class || '') + ' main'} style={$$restProps.style}>
  <Link
    to="/"
    on:click={() => {
      setSelectedProject()
    }}
  >
    <div class="tab" class:selected={!$localStore.selectedProjectId}>
      <Icon type="dashboardFill" />
    </div>
  </Link>
  {#each $localStore.openedProjects as project}
    <Link
      to={`/project/${project.id}`}
      on:click={() => {
        setSelectedProject(project.id)
      }}
    >
      <div
        class="tab project"
        class:selected={$localStore.selectedProjectId === project.id}
      >
        {randomEmoji()}
        <div style={`width: 15px;`} />

        {project.name}
        <div
          class="tabEnd"
          on:click|stopPropagation|preventDefault={() => {
            const nextId = removeOpenedProject(project.id)
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
  {/each}
</div>

<style>
  .main {
    width: 100%;
    height: 100%;
    display: flex;
    background: var(--colors__bottom);
  }

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
