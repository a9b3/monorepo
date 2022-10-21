<script lang="ts">
  import Icon from 'src/components/Icon.svelte'

  export let title: string
  export let onClose: () => void
</script>

<div class="main">
  <div class="left">
    <slot name="left" />
  </div>
  <div class="middle">{title}</div>
  <div class="right">
    <div class="item" on:click={onClose}>
      <Icon type="closeLine" />
    </div>
  </div>
</div>

<style>
  .main {
    background: var(--colors__bg);
    height: 100%;
    width: 100%;
    display: grid;
    grid-template: 'left middle right' 1fr / 1fr 1fr 1fr;
    border-bottom: 1px solid var(--colors__bg2);
  }
  .main:hover {
    opacity: 0.98;
  }

  .left {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: start;
  }
  .middle {
    font-weight: bold;
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
  }
  .right {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: end;
  }

  .item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 40px;
  }
  .item:hover {
    filter: brightness(0.8);
  }
</style>
