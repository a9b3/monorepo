import { EventEmitter } from 'events'

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

// Get the top left right bottom values of the selection box.
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

function getElementRect(el: HTMLElement) {
  return {
    top: el.offsetTop,
    left: el.offsetLeft,
    right: el.offsetLeft + el.offsetWidth,
    bottom: el.offsetTop + el.offsetHeight,
  }
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
    return {
      x: this.container.scrollLeft + evt.clientX - this.container.offsetLeft,
      y: this.container.scrollTop + evt.clientY - this.container.offsetTop,
    }
  }

  #onmousedown = (evt: MouseEvent) => {
    this.checkContainer()
    // Only process event if it is inside the container.
    if (!this.#containerExclusive(evt.target as HTMLElement)) {
      return undefined
    }

    this.#origin = {
      x: this.container.scrollLeft + evt.clientX - this.container.offsetLeft,
      y: this.container.scrollTop + evt.clientY - this.container.offsetTop,
    }

    this.sbox.style.display = 'block'
    this.sbox.style.position = 'absolute'
    this.sbox.style.left = `${this.#origin.x}px`
    this.sbox.style.top = `${this.#origin.y}px`
    this.sbox.style.width = `0px`
    this.sbox.style.height = `0px`
    this.sbox.style.transform = `translate(0px, 0px)`

    window.addEventListener('mousemove', this.#onmousemove)
    window.addEventListener('mouseup', this.#onmouseup)
  }

  #detectSelectableIntersections = (r1: Rect) => {
    Object.values(this.selectable).forEach(({ el, id }) => {
      const r2 = getElementRect(el)
      if (intersectRect(r1, r2)) {
        this.selected[id] = el
      } else {
        delete this.selected[id]
      }
    })

    this.emit('update')
  }

  #onmousemove = (evt: MouseEvent) => {
    this.checkContainer()

    const pos = this.#getMouseXY(evt)
    let deltaX = pos.x - this.#origin.x
    deltaX = this.#origin.x + deltaX < 0 ? -this.#origin.x : deltaX
    deltaX =
      deltaX > this.container.offsetWidth ? this.container.offsetWidth : deltaX
    let deltaY = pos.y - this.#origin.y
    deltaY = this.#origin.y + deltaY < 0 ? -this.#origin.y : deltaY
    deltaY =
      deltaY > this.container.offsetHeight
        ? this.container.offsetHeight
        : deltaY

    this.sbox.style.transform = `translate(${deltaX < 0 ? deltaX : 0}px, ${
      deltaY < 0 ? deltaY : 0
    }px)`
    this.sbox.style.width = `${Math.abs(deltaX)}px`
    this.sbox.style.height = `${Math.abs(deltaY)}px`

    this.#detectSelectableIntersections(
      getSeletionBoxCoords(deltaX, deltaY, this.#origin.x, this.#origin.y)
    )
  }

  #onmouseup = (evt: MouseEvent) => {
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
