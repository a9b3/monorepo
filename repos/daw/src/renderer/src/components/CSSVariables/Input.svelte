<script lang="ts">
  export let value = ''
  export let type = 'text'
  export let placeholder = ''

  function handleClick(event: MouseEvent) {
    event.target.select()
  }
</script>

<input type="text" bind:value {placeholder} on:click={handleClick} class="inherit-input" />

<style>
  .inherit-input {
    all: inherit;
    display: inline-block;
    background-color: transparent;
    border: none;
    padding: 2px;
    margin: 0;
    width: 100%;
    font: inherit;
    color: inherit;
    outline: none;
    cursor: default;
    box-shadow: none;
  }

  .inherit-input::placeholder {
    color: inherit;
    opacity: 0.6;
  }
</style>
