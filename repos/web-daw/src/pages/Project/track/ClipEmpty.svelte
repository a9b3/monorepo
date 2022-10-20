<script lang="ts">
  import type { Track } from 'daw/core/project'

  export let idx: number
  export let addClip: InstanceType<typeof Track>['addMidiClip']
  export let setActiveClip: InstanceType<typeof Track>['setActiveMidiClip']
</script>

<div
  class="clip"
  on:click={() => {
    setActiveClip(addClip(idx).id)
  }}
>
  <div class="icon" />
</div>

<style>
  .clip {
    border-bottom: 1px dashed var(--colors__fg3);
    height: 22px;
    display: flex;
    position: relative;
  }
  .clip:hover {
    animation: pulse 0.4s infinite;
  }

  @keyframes pulse {
    0% {
      background: hsl(
        var(--hsl__neonPink-h),
        var(--hsl__neonPink-s),
        calc(var(--hsl__neonPink-l) + 5%),
        0.2
      );
    }

    50% {
      background: hsl(
        var(--hsl__neonPink-h),
        var(--hsl__neonPink-s),
        calc(var(--hsl__neonPink-l) + 20%),
        0.2
      );
    }

    100% {
      background: hsl(
        var(--hsl__neonPink-h),
        var(--hsl__neonPink-s),
        var(--hsl__neonPink-l),
        0.2
      );
    }
  }

  .icon {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 2px;
    width: 100%;
    justify-content: flex-end;
    opacity: 0.1;
  }
</style>
