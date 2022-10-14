<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { directSubtreeOf } from 'src/utils'
  import { selectorStore, setSelecting } from './selectorStore'
  import { keyboard } from 'src/store/keyboard'

  export let requireModKey = true
  export let onDel = (selected: {}) => {}

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

  const collisonBounds = {
    originX: 0,
    originY: 0,
    deltaX: 0,
    deltaY: 0,
  }

  function onmousedown(evt: MouseEvent) {
    console.log(evt, parentEl, el)
    if (
      !directSubtreeOf(
        evt.target as HTMLElement,
        el,
        compEl => compEl.getAttribute('data-component-type') === 'selector'
      )
    ) {
      console.log(`jerer`)
      return
    }
    selectorStore.selected = {}
    selectorStore.emit('update')
    if (requireModKey && !evt.metaKey) {
      return
    }
    setSelecting(true)

    const bound = parentEl.getBoundingClientRect()
    collisonBounds.originX = evt.clientX - bound.left
    collisonBounds.originY = evt.clientY - bound.top
    originX = evt.clientX
    originY = evt.clientY

    maxTop = bound.top - evt.clientY
    maxLeft = bound.left - evt.clientX
    maxRight = bound.right - evt.clientX
    maxBottom = bound.bottom - evt.clientY

    // parentEl.style.position = 'relative'
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

      collisonBounds.deltaX = evt.clientX - bound.left - originX
      collisonBounds.deltaX =
        collisonBounds.deltaX < maxLeft
          ? maxLeft
          : collisonBounds.deltaX > maxRight
          ? maxRight
          : collisonBounds.deltaX
      collisonBounds.deltaY = evt.clientY - bound.top - collisonBounds.originY
      collisonBounds.deltaY =
        collisonBounds.deltaY < maxTop
          ? maxTop
          : collisonBounds.deltaY > maxBottom
          ? maxBottom
          : collisonBounds.deltaY

      let deltaX = evt.clientX - originX
      deltaX =
        deltaX < maxLeft ? maxLeft : deltaX > maxRight ? maxRight : deltaX
      let deltaY = evt.clientY - originY
      deltaY =
        deltaY < maxTop ? maxTop : deltaY > maxBottom ? maxBottom : deltaY

      el.style.transform = `translate(${deltaX < 0 ? deltaX : 0}px, ${
        deltaY < 0 ? deltaY : 0
      }px)`
      el.style.width = `${Math.abs(deltaX)}px`
      el.style.height = `${Math.abs(deltaY)}px`

      const r1 = getSeletionBoxCoords(
        collisonBounds.deltaX,
        collisonBounds.deltaY,
        collisonBounds.originX,
        collisonBounds.originY
      )
      selectorStore.selectable.forEach(({ el, id }) => {
        console.log(el)
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
          delete selectorStore.selected[id]
        }
      })
      selectorStore.emit('update')
    })
  }

  function onmouseup() {
    document.removeEventListener('mousemove', onmousemove)
    document.removeEventListener('mouseup', onmouseup)
    el.style.display = 'none'
    setSelecting(false)
  }

  function delHandler(evt: KeyboardEvent) {
    switch (evt.key) {
      case 'Backspace':
        onDel(selectorStore.selected)
        break
      default:
        return
    }
  }

  onMount(() => {
    parentEl = el.parentElement
    parentEl.addEventListener('mousedown', onmousedown)
    keyboard.attach(delHandler)
  })
  onDestroy(() => {
    parentEl.removeEventListener('mousedown', onmousedown)
    document.removeEventListener('mousemove', onmousemove)
    document.removeEventListener('mouseup', onmouseup)
    keyboard.detach(delHandler)
  })
</script>

<div bind:this={el} class={'main'} data-component-type="selector" />

<style>
  .main {
    display: none;
    position: fixed;
    background: hsl(var(--hsl__bg-h), var(--hsl__bg-s), var(--hsl__bg-l), 0.5);
    z-index: 10;
    border: 1px solid var(--colors__accent);
  }
</style>
