<script lang="ts">
  import { Text } from 'src/components'

  export let onNewMidi: () => void
</script>

<div class={($$restProps.class || '') + ' main'} style={$$restProps.style}>
  <div class="card" on:mousedown={() => onNewMidi()}>
    <Text color={'fg3'}>New MIDI</Text>
  </div>
</div>

<style>
  .main {
    border: 1px dashed var(--colors__fg3);
    border-radius: 4px;
    padding: 10px;
    height: 100%;
    display: flex;
    width: 120px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .card {
    border: 1px solid var(--colors__fg3);
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .card:hover {
    background-color: var(--colors__fg2);
  }
</style>
