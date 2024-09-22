<script>
  export let cursorColor = '#000000'
  export let cursorWidth = '2px'
  export let cursorHeight = '1em'
  export let blinkDuration = '1s'
</script>

<span
  class="cursor"
  style="--cursor-color: {cursorColor}; --cursor-width: {cursorWidth}; --cursor-height: {cursorHeight}; --blink-duration: {blinkDuration};"
></span>

<style>
  .cursor {
    display: inline-block;
    width: var(--cursor-width);
    height: var(--cursor-height);
    background-color: var(--cursor-color);
    animation: blink var(--blink-duration) infinite;
  }

  @keyframes blink {
    0%,
    100% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
  }
</style>
