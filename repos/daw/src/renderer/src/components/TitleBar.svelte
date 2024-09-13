<script>
  import { onMount } from 'svelte'

  let ipcRenderer
  let isHovering = false

  onMount(async () => {
    // Import ipcRenderer from Electron
    ipcRenderer = window.require('electron').ipcRenderer
  })

  function closeWindow() {
    ipcRenderer.send('close-window')
  }

  function minimizeWindow() {
    ipcRenderer.send('minimize-window')
  }

  function maximizeWindow() {
    ipcRenderer.send('maximize-window')
  }

  function handleMouseEnter() {
    isHovering = true
  }

  function handleMouseLeave() {
    isHovering = false
  }
</script>

<div class="titlebar">
  <div class="titlebar-buttons" on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave}>
    <button class="close" on:click={closeWindow}>
      <span class="icon" class:visible={isHovering}>✕</span>
    </button>
    <button class="minimize" on:click={minimizeWindow}>
      <span class="icon" class:visible={isHovering}>−</span>
    </button>
    <button class="maximize" on:click={maximizeWindow}>
      <span class="icon" class:visible={isHovering}>+</span>
    </button>
  </div>
  <div class="titlebar-title">
    <slot></slot>
  </div>
  <div class="titlebar-placeholder"></div>
</div>

<style>
  .titlebar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 28px;
    /* background-color: #f6f6f6; */
    -webkit-app-region: drag;
    position: relative;
    border-bottom: 1px solid black;
  }

  .titlebar-buttons {
    display: flex;
    align-items: center;
    padding-left: 8px;
    -webkit-app-region: no-drag;
    z-index: 1;
  }

  .titlebar-title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
      'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: #4d4d4d;
  }

  .titlebar-placeholder {
    width: 70px; /* Adjust this to match the width of titlebar-buttons */
  }

  button {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 8px;
    border: none;
    outline: none;
    -webkit-app-region: no-drag;
    position: relative;
    transition: background-color 0.1s ease;
  }

  .close {
    background-color: #ff5f56;
  }

  .minimize {
    background-color: #ffbd2e;
  }

  .maximize {
    background-color: #27c93f;
  }

  button:active {
    filter: brightness(0.8);
  }

  .icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: rgba(0, 0, 0, 0.5);
    font-size: 9px;
    opacity: 0;
    transition: opacity 0.1s ease;
  }

  .icon.visible {
    opacity: 1;
  }

  .titlebar-buttons:hover .close {
    background-color: #ff3b30;
  }

  .titlebar-buttons:hover .minimize {
    background-color: #ffab00;
  }

  .titlebar-buttons:hover .maximize {
    background-color: #00c853;
  }
</style>
