<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import ContextMenu from 'src/components/ContextMenu.svelte'
  import editorStore from 'src/store/editor'
  import { fetchProject } from 'src/store/project'
  import { navigate } from 'svelte-routing'
  import { setSelectedProject } from 'src/store/editor'
  import projectDB from 'src/database/project'

  import LeftPanel from './LeftPanel.svelte'
  import TopToolbar from './TopToolbar.svelte'
  import Track from './track/Track.svelte'
  import Master from './track/Master.svelte'
  // import Send from './track/Send.svelte'

  export let params: { id: string }

  $: id = params.id
  $: {
    ;(async () => {
      try {
        await fetchProject(params.id)
      } catch (err) {
        setSelectedProject('')
        navigate('/', { replace: true })
      }
    })()
  }
  $: project = $editorStore.openedProjects.find(proj => {
    return proj.id === id
  })

  let contextMenuRef: ContextMenu

  // auto-save projects every 5 seconds
  let interval: number
  onMount(() => {
    projectDB.update(project.id, project)
    interval = setInterval(() => {
      projectDB.update(project.id, project)
    }, 5000)
  })
  onDestroy(() => {
    clearInterval(interval)
  })
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
      {#each $project.trackOrder as trackId}
        <div class="track">
          <Track track={$project.tracks[trackId]} project={$project} />
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
        <Master channel={$project.mixer.master} />
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
    width: 100%;
    height: 100%;
    overflow: hidden;
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
  }
</style>
