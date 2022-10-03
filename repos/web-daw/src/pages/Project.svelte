<script lang="ts">
  import { afterUpdate } from 'svelte'
  import TopToolbar from 'src/components/TopToolbar.svelte'
  import LeftPanel from 'src/components/LeftPanel.svelte'
  import Track from 'src/components/Track.svelte'
  import ContextMenu from 'src/components/ContextMenu.svelte'
  import root, { addClipTrack } from 'src/state/project'
  import projectStore, { fetchProject } from 'src/store/project'
  export let params

  $: id = params.id
  $: {
    ;(async () => {
      await fetchProject(params.id)
      console.log(`is this recursing`, Math.random() * 5)
    })()
    console.log(`is this recursing`, Math.random() * 5)
  }
  $: project = $projectStore.projects[id]

  let contextMenuRef
</script>

<div class="app-shell">
  <div class="top-toolbar">
    <TopToolbar {project} />
  </div>
  <div class="left-panel">
    <LeftPanel />
  </div>
  <div
    class="main-content"
    on:contextmenu|preventDefault={contextMenuRef.handleRightClick}
  >
    <ContextMenu
      bind:this={contextMenuRef}
      menu={[
        {
          label: 'Add Track',
          onClick: () => {
            addClipTrack()
          },
          type: 'item',
        },
      ]}
    />
    {#each $root.clipTracks as track, idx}
      <div class="track">
        <Track {track} {idx} />
      </div>
    {/each}
  </div>
  <div class="bottom-panel" />
</div>

<style>
  .app-shell {
    font-family: var(--font__family);
    font-size: var(--font__size);
    color: var(--font__color);
    font-weight: var(--font__weight);
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: grid;
    grid-template:
      'top top' 40px
      'left main' 1fr
      / auto 1fr;
    background: var(--colors__bg3);
  }

  .top-toolbar {
    grid-area: top;
    border-bottom: 1px solid var(--colors__bg3);
  }

  .left-panel {
    grid-area: left;
  }

  .main-content {
    grid-area: main;
    display: flex;
    flex-direction: row;
    height: 100%;
    padding: var(--spacing__padding);
    overflow: auto;
  }

  .track {
    display: flex;
    height: 100%;
    margin-right: var(--spacing__paddingM);
  }
</style>
