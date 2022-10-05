<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import type { Project } from 'src/daw/Project'
  import Pill from 'src/components/Pill.svelte'
  import Layout from 'src/components/Layout.svelte'
  import Icon from 'src/components/Icon.svelte'
  import { audioContext } from 'src/daw/audioContext'

  export let project: Project

  let elapsedBeats = 0

  function handleStart() {}
  function handleStop() {
    elapsedBeats = 0
  }
  function handleTick(args) {
    const currentBeat = Math.floor(args.currentTick / args.ticksPerBeat) % 4
    if (currentBeat !== elapsedBeats) {
      elapsedBeats = currentBeat
    }
  }
  onMount(() => {
    project.controller.on('start', handleStart)
    project.controller.on('stop', handleStop)
    project.controller.on('tick', handleTick)
  })
  onDestroy(() => {
    project.controller.removeListener('start', handleStart)
    project.controller.removeListener('stop', handleStop)
    project.controller.removeListener('tick', handleTick)
  })
</script>

<div class="main">
  <Layout class="left">
    <Pill title="Link" disabled />
    <Pill title="Tap" disabled />
    <Pill title={String(project.controller.bpm) + ' bpm'} />
    <Pill
      title={String(project.timeSignature.top) +
        ' / ' +
        String(project.timeSignature.bottom)}
    />
    <Pill title="1 Bar" />
  </Layout>
  <Layout class="center">
    <Pill title="{elapsedBeats + 1}. 1. 1" disabled />
    <Pill
      on:click={() => {
        // browser requires user action to allow playback
        audioContext.resume()

        if ($project.controller.isPlaying) {
          $project.controller.stop()
        } else {
          $project.controller.play()
        }
      }}><Icon type="arrowRightFill" /></Pill
    >
  </Layout>
  <div class="right">
    <Pill title="MIDI" />
  </div>
</div>

<style>
  .main {
    padding: 0px var(--spacing__padding);
    width: 100%;
    height: 100%;
    background: var(--colors__bg);
    display: grid;
    grid-template:
      'left center right'
      / 1fr 1fr 1fr;
    align-items: center;
  }

  .main :global(.left) {
    grid-area: 'left';
    display: flex;
  }
  .main :global(.center) {
    grid-area: 'center';
    display: flex;
    justify-content: center;
  }
  .right {
    grid-area: 'right';
    display: flex;
    justify-content: flex-end;
  }
</style>
