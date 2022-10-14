<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { selectorStore, setSelecting } from './selectorStore'

  export let requireModKey = true

  let el: HTMLElement
  let parentEl: HTMLElement

  let originX: number
  let originY: number

  let maxTop: number
  let maxLeft: number
  let maxRight: number
  let maxBottom: number

  type Rect = {
    top: number
    left: number
    right: number
    bottom: number
  }

  function intersectRect(r1: Rect, r2: Rect) {
    return !(
      r2.left > r1.right ||
      r2.right < r1.left ||
      r2.top > r1.bottom ||
      r2.bottom < r1.top
    )
  }

  function getSeletionBoxCoords(
    deltaX: number,
    deltaY: number,
    originX: number,
    originY: number
  ) {
    const calcX = deltaX + originX
    const calcY = deltaY + originY

    return {
      top: calcY > originY ? originY : calcY,
      left: calcX > originX ? originX : calcX,
      right: calcX > originX ? calcX : originX,
      bottom: calcY > originY ? calcY : originY,
    }
  }

  function onmousedown(evt: MouseEvent) {
    selectorStore.selected = {}
    selectorStore.emit('update')
    if (requireModKey && !evt.ctrlKey) {
      return
    }
    setSelecting(true)

    const bound = parentEl.getBoundingClientRect()
    originX = evt.clientX - bound.left
    originY = evt.clientY - bound.top

    maxTop = bound.top - evt.clientY
    maxLeft = bound.left - evt.clientX
    maxRight = bound.right - evt.clientX
    maxBottom = bound.bottom - evt.clientY

    el.style.display = 'inline'
    el.style.left = `${originX}px`
    el.style.top = `${originY}px`
    el.style.transform = `translate(0px, 0px)`
    el.style.width = `0px`
    el.style.height = `0px`

    document.addEventListener('mousemove', onmousemove)
    document.addEventListener('mouseup', onmouseup)
  }

  function onmousemove(evt: MouseEvent) {
    window.requestAnimationFrame(() => {
      const bound = parentEl.getBoundingClientRect()

      let deltaX = evt.clientX - bound.left - originX
      deltaX =
        deltaX < maxLeft ? maxLeft : deltaX > maxRight ? maxRight : deltaX
      let deltaY = evt.clientY - bound.top - originY
      deltaY =
        deltaY < maxTop ? maxTop : deltaY > maxBottom ? maxBottom : deltaY

      el.style.transform = `translate(${deltaX < 0 ? deltaX : 0}px, ${
        deltaY < 0 ? deltaY : 0
      }px)`
      el.style.width = `${Math.abs(deltaX)}px`
      el.style.height = `${Math.abs(deltaY)}px`

      const r1 = getSeletionBoxCoords(deltaX, deltaY, originX, originY)
      selectorStore.selectable.forEach(({ el, id }) => {
        const r2Bound = el.getBoundingClientRect()
        const r2 = {
          top: r2Bound.top - bound.top,
          left: r2Bound.left - bound.left,
          right: 0,
          bottom: 0,
        }
        r2.right = r2.left + el.offsetWidth
        r2.bottom = r2.top + el.offsetHeight

        if (intersectRect(r1, r2)) {
          selectorStore.selected[id] = true
        } else {
          selectorStore.selected[id] = false
        }
      })
      selectorStore.emit('update')
    })
  }

  function onmouseup() {
    el.style.display = 'none'
    setSelecting(false)
    document.removeEventListener('mousemove', onmousemove)
    document.removeEventListener('mouseup', onmouseup)
  }

  onMount(() => {
    parentEl = el.parentElement
    parentEl.addEventListener('mousedown', onmousedown)
  })
  onDestroy(() => {
    parentEl.removeEventListener('mousedown', onmousedown)
    document.addEventListener('mousemove', onmousemove)
    document.addEventListener('mouseup', onmouseup)
  })
</script>

<div bind:this={el} class={'main'} />

<style>
  .main {
    display: none;
    position: absolute;
    background: hsl(var(--hsl__bg-h), var(--hsl__bg-s), var(--hsl__bg-l), 0.5);
    z-index: 10;
    border: 1px solid var(--colors__accent);
  }
</style>
