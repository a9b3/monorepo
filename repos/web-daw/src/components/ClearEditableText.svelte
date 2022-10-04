<script lang="ts">
  export let foo = ''
  export let handleInput
</script>

<input class="main" bind:value={foo} on:input={handleInput} />

<style>
  .main {
    all: unset;
    user-select: text;
    pointer-events: auto;
  }
</style>
