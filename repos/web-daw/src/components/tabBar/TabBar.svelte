<!--
  @component

  The top level tab bar for navigating opened projects.
-->
<script lang="ts">
  import Icon from 'src/components/Icon.svelte'
  import { Link } from 'svelte-routing'
  import Tab from 'src/components/tabBar/Tab.svelte'
  import editorStore, { setSelectedProject } from 'src/store/editor'
</script>

<div class={($$restProps.class || '') + ' main'} style={$$restProps.style}>
  <Link
    to="/"
    on:click={() => {
      setSelectedProject()
    }}
  >
    <div class="tab" class:selected={!$editorStore.selectedProjectId}>
      <Icon type="dashboardFill" />
    </div>
  </Link>
  {#each $editorStore.openedProjects as project}
    <Tab {project} />
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
