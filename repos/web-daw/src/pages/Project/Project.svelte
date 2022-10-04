<script lang="ts">
  import ContextMenu from 'src/components/ContextMenu.svelte'
  import editorStore from 'src/store/editor'
  import { fetchProject } from 'src/store/project'
  import { navigate } from 'svelte-routing'
  import { setSelectedProject } from 'src/store/editor'

  import LeftPanel from './LeftPanel.svelte'
  import TopToolbar from './TopToolbar.svelte'
  import Track from './track/Track.svelte'
  import Master from './track/Master.svelte'
  // import Send from './track/Send.svelte'

  export let params: { id: string }

  let isFetching = true
  $: id = params.id
  $: {
    ;(async () => {
      isFetching = true
      try {
        await fetchProject(params.id)
      } catch (err) {
        setSelectedProject('')
        navigate('/', { replace: true })
      }
      isFetching = false
    })()
  }
  $: project = $editorStore.openedProjects.find(proj => {
    return proj.id === id
  })

  let contextMenuRef: ContextMenu
</script>

<div class="app-shell">
  {#if $project}
    <div class="top">
      <TopToolbar {project} />
    </div>
    <div class="left">
      <LeftPanel />
    </div>
    <div
      class="main"
      on:contextmenu|preventDefault={contextMenuRef.handleRightClick}
    >
      <ContextMenu
        bind:this={contextMenuRef}
        menu={[
          {
            label: 'Add Track',
            onClick: () => {
              $project.addTrack({ label: 'Untitled' })
            },
            type: 'item',
          },
        ]}
      />
      {#each $project.trackOrder as trackId, idx}
        <div class="track">
          <Track track={$project.tracks[trackId]} {idx} project={$project} />
        </div>
      {/each}
    </div>
    <div class="sends">
      <!-- TODO add sends -->
      <!-- <div class="track"> -->
      <!--   <Send trackId={send.id} /> -->
      <!-- </div> -->
    </div>
    <div class="master">
      <div class="track">
        <Master trackId={$project.mixer.master.id} />
      </div>
    </div>
    <div class="bottom-panel" />
  {/if}
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
      'top top top top' 40px
      'left main sends master' 1fr
      / auto 1fr auto auto;
    background: var(--colors__bg3);
  }

  .top {
    grid-area: top;
    border-bottom: 1px solid var(--colors__bg3);
  }

  .left {
    grid-area: left;
  }

  .main {
    grid-area: main;
    display: flex;
    flex-direction: row;
    height: 100%;
    padding: var(--spacing__paddingSm);
    overflow: auto;
  }

  .track {
    display: flex;
    height: 100%;
    margin-right: var(--spacing__marginM);
  }

  .sends {
    grid-area: sends;
    padding: var(--spacing__paddingSm) 0;
  }

  .master {
    grid-area: master;
    padding: var(--spacing__paddingSm) 0;
  }
</style>
