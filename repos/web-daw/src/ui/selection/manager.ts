import { EventEmitter } from 'events'
import { getScrollParent } from 'src/utils'
import { zindex } from '../zindex'

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

function getElementRect(el: HTMLElement, container: HTMLElement) {
  const containerBound = container.getBoundingClientRect()
  const elBound = el.getBoundingClientRect()

  const offsetTop = elBound.top - containerBound.top
  const offsetLeft = elBound.left - containerBound.left

  return {
    top: offsetTop,
    left: offsetLeft,
    right: offsetLeft + el.offsetWidth,
    bottom: offsetTop + el.offsetHeight,
  }
}

function parseCSSTransform(transform: string): number[] {
  let xy = [0, 0, 0, 0, 0, 0]
  if (transform) {
    let str = transform.replace('matrix(', '')
    str = str.replace(')', '')
    xy = str
      .split(',')
      .map(a => a.trim())
      .map(parseFloat)
  }
  return xy
}
/**
 * Selection Manager
 *
 * Click and drag selection.
 */
export class SelectionManager extends EventEmitter {
  /**
   * Attr to identify a dom node as a selection container.
   */
  #attrKey = 'data-selection-component-type'
  #attrVal = 'selector'
  /**
   * The container in which selection can occur. This container must be position
   * relative.
   */
  container: HTMLElement
  scrollParent: HTMLElement
  /**
   * The selectable elements within the container.
   */
  selectable: { [id: string]: { el: HTMLElement; id: string } } = {}
  selected: { [id: string]: HTMLElement } = {}
  /**
   * Reference to the HTMLElement created to display the selection box.
   */
  sbox: HTMLElement

  // onmousedown tracking of mouse position origin
  #origin = {
    x: 0,
    y: 0,
  }

  constructor() {
    super()
    this.setMaxListeners(200)
  }

  registerContainer(container: HTMLElement) {
    this.container = container
    // This is used to scan up the tree for a given element to see which
    // container evt originated from.
    // ex. stop at first parent selector and compare to see if it matches
    // container reference
    this.container.setAttribute(this.#attrKey, this.#attrVal)
    this.container.addEventListener('mousedown', this.#onmousedown)
    this.scrollParent = getScrollParent(this.container)
  }
  checkContainer() {
    if (!this.container) {
      throw new Error(`Must register a html with 'registerContainer' first.`)
    }
  }

  unregisterContainer() {
    this.checkContainer()
    this.container.removeEventListener('mousedown', this.#onmousedown)
    window.removeEventListener('mousemove', this.#onmousemove)
    window.removeEventListener('mouseup', this.#onmouseup)
  }

  registerSelectable(id: string, el: HTMLElement) {
    this.selectable[id] = { id, el }
  }

  unregisterSelectable(id: string) {
    delete this.selectable[id]
    delete this.selected[id]
  }

  setSelectionBox(el: HTMLElement) {
    this.sbox = el
  }

  /**
   * Check if element is within the context of the current container.
   * Useful for detecting events within nested containers. You would only want
   * to allow selection in the most immediate container.
   */
  #containerExclusive = (el: HTMLElement): boolean => {
    this.checkContainer()

    if (['fixed', 'absolute'].includes(getComputedStyle(el).position)) {
      return false
    }
    if (!el.parentElement) {
      return false
    }

    for (let i = 0; i < el.parentElement.children.length; i += 1) {
      const child = el.parentElement.children.item(i)
      if (
        child.getAttribute(this.#attrKey) === this.#attrVal &&
        child !== this.container
      ) {
        return false
      }
      if (
        child.getAttribute(this.#attrKey) === this.#attrVal &&
        child === this.container
      ) {
        return true
      }
    }

    return this.#containerExclusive(el.parentElement)
  }

  #getMouseXY(evt: MouseEvent) {
    const containerBound = this.container.getBoundingClientRect()
    return {
      x: this.container.scrollLeft + evt.clientX - containerBound.left,
      y: this.container.scrollTop + evt.clientY - containerBound.top,
    }
  }

  #onmousedown = (evt: MouseEvent) => {
    this.checkContainer()
    // Only process event if it is inside the container.
    if (!this.#containerExclusive(evt.target as HTMLElement)) {
      return
    }

    const containerBound = this.container.getBoundingClientRect()
    this.#origin = {
      x: this.container.scrollLeft + evt.clientX - containerBound.left,
      y: this.container.scrollTop + evt.clientY - containerBound.top,
    }

    this.sbox.style.display = 'block'
    this.sbox.style.position = 'absolute'
    this.sbox.style.left = `${this.#origin.x}px`
    this.sbox.style.top = `${this.#origin.y}px`
    this.sbox.style.width = `0px`
    this.sbox.style.height = `0px`
    this.sbox.style.transform = `translate(0px, 0px)`
    this.sbox.style.zIndex = zindex.selection

    window.addEventListener('mousemove', this.#onmousemove)
    window.addEventListener('mouseup', this.#onmouseup)
  }

  #detectSelectableIntersections = (r1: Rect) => {
    Object.values(this.selectable).forEach(({ el, id }) => {
      const r2 = getElementRect(el, this.container)
      if (intersectRect(r1, r2)) {
        this.selected[id] = el
      } else {
        delete this.selected[id]
      }
    })

    this.emit('update')
  }

  #onmousemove = (evt: MouseEvent) => {
    window.requestAnimationFrame(() => {
      this.checkContainer()

      const pos = this.#getMouseXY(evt)

      let deltaX = pos.x - this.#origin.x
      deltaX = this.#origin.x + deltaX < 0 ? -this.#origin.x : deltaX
      deltaX =
        this.#origin.x + deltaX >
        this.container.offsetWidth + (this.scrollParent.scrollLeft || 0)
          ? this.container.offsetWidth +
            (this.scrollParent.scrollLeft || 0) -
            this.#origin.x
          : deltaX

      let deltaY = pos.y - this.#origin.y
      deltaY = this.#origin.y + deltaY < 0 ? -this.#origin.y : deltaY
      deltaY =
        this.#origin.y + deltaY > this.container.offsetHeight
          ? this.container.offsetHeight - this.#origin.y
          : deltaY

      this.sbox.style.transform = `translate(${deltaX < 0 ? deltaX : 0}px, ${
        deltaY < 0 ? deltaY : 0
      }px)`
      this.sbox.style.width = `${Math.abs(deltaX)}px`
      this.sbox.style.height = `${Math.abs(deltaY)}px`

      const computedStyle = getComputedStyle(this.sbox)
      const transformxy = parseCSSTransform(computedStyle.transform)
      const y = transformxy.pop()
      const x = transformxy.pop()
      const offsetY = parseFloat(computedStyle.top) + y
      const offsetX = parseFloat(computedStyle.left) + x
      this.#detectSelectableIntersections({
        top: offsetY,
        left: offsetX,
        right: offsetX + parseFloat(computedStyle.width),
        bottom: offsetY + parseFloat(computedStyle.height),
      })
    })
  }

  #onmouseup = () => {
    this.checkContainer()
    this.sbox.style.display = 'none'

    window.removeEventListener('mousemove', this.#onmousemove)
    window.removeEventListener('mouseup', this.#onmouseup)
  }

  /**
   * Svelte subscribe method.
   */
  subscribe = (listener: (state: this) => void) => {
    listener(this)

    const invokeListener = () => {
      listener(this)
    }

    this.on('update', invokeListener)

    return () => {
      this.removeListener('update', invokeListener)
    }
  }
}
