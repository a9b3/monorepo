<script lang="ts">
  import { onMount, onDestroy, beforeUpdate } from 'svelte'
  import { navigate } from 'svelte-routing'
  import { ContextMenu } from 'src/components'
  import { editorStore, setSelectedProject, fetchProject } from 'src/store'
  import { trackMousePosition, untrackMousePosition } from 'src/utils'

  import AutoSave from './AutoSave.svelte'
  import LeftPanel from './LeftPanel.svelte'
  import Toolbar from './Toolbar.svelte'
  import Master from './Track/Master.svelte'
  import NewTrackHelper from './Track/NewTrackHelper.svelte'
  import Track from './Track/Track.svelte'

  export let params: { id: string }

  $: project = $editorStore.openedProjects.find(proj => {
    return proj.id === params.id
  })

  let contextMenuRef: ContextMenu

  beforeUpdate(async () => {
    try {
      await fetchProject(params.id)
    } catch (err) {
      setSelectedProject()
      navigate('/', { replace: true })
    }
  })
  onMount(() => {
    trackMousePosition()
  })
  onDestroy(() => {
    untrackMousePosition()
  })
</script>

<AutoSave id={params.id} />
<div class="app-shell">
  {#if $project}
    <div class="top">
      <Toolbar project={$project} />
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
              $project.addTrack({ label: 'Untitled', id: crypto.randomUUID() })
            },
            type: 'item',
          },
        ]}
      />
      {#each $project.tracks as track}
        <div class="track">
          <Track {track} project={$project} />
        </div>
      {/each}
      <NewTrackHelper
        onNewMidi={() =>
          $project.addTrack({ label: 'MIDI', id: crypto.randomUUID() })}
      />
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
