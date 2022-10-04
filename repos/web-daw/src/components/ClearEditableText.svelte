<!--
  @component

  For editing text and display at once.
-->
<script lang="ts">
  export let value = ''
  export let handleInput: (evt: Event) => void
</script>

<input class="main" bind:value on:input={handleInput} />

<style>
  .main {
    all: unset;
    user-select: text;
    pointer-events: auto;
  }
</style>
