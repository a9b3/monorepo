<script>
  import { onMount, onDestroy } from 'svelte'

  export let target

  let ref
  let targetEl

  onMount(() => {
    targetEl = typeof target === 'string' ? document.querySelector(target) : target
    targetEl.appendChild(ref)

    return () => {
      if (targetEl && ref.parentNode === targetEl) {
        targetEl.removeChild(ref)
      }
    }
  })

  onDestroy(() => {
    if (targetEl && ref.parentNode === targetEl) {
      targetEl.removeChild(ref)
    }
  })
</script>

<div bind:this={ref}>
  <slot></slot>
</div>
