<script lang="ts">
  let el: HTMLInputElement
  export let handleUrl

  $: {
    el?.addEventListener('change', function (evt) {
      const fileUrl = URL.createObjectURL(this.files[0])
      handleUrl(fileUrl)
    })
  }
</script>

<div class={($$restProps.class || '') + ' main'} style={$$restProps.style}>
  <input class="input" bind:this={el} type="file" accept="audio/*" />
</div>

<style>
  .main {
  }

  .input {
    all: unset;
  }
</style>
