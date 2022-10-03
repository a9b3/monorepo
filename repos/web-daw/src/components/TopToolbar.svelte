<script lang="ts">
  import Pill from 'src/components/Pill.svelte'
  import Layout from 'src/components/Layout.svelte'
  import Icon from 'src/components/Icon.svelte'
  export let project
</script>

<div class="main">
  <Layout class="left">
    <Pill title="Link" disabled />
    <Pill title="Tap" disabled />
    <Pill title={String(project.bpm) + ' bpm'} />
    <Pill
      title={String(project.timeSignature.top) +
        ' / ' +
        String(project.timeSignature.bottom)}
    />
    <Pill title="1 Bar" />
  </Layout>
  <Layout class="center">
    <Pill title="1. 1. 1" disabled />
    <Pill><Icon type="arrowRightFill" /></Pill>
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
