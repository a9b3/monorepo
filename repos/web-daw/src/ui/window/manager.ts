import { EventEmitter } from 'events'
import { mousePosition } from '../mouse/position'

/**
 * Set initial window position.
 */
function renderInitialWindow(
  node: HTMLElement,
  opt?: {
    /**
     * Control where to position the window upon creation.
     *
     *  center:
     *    center of anchor
     *  undercursor:
     *    centered under cursor
     */
    createBehavior?: 'center' | 'undercursor'
    // Bound the top position to not go above this
    marginTop?: number
  }
) {
  opt = opt || {}
  opt.createBehavior = opt.createBehavior || 'center'
  opt.marginTop = opt.marginTop || 0

  let left = 0
  let top = 0
  switch (opt.createBehavior) {
    case 'undercursor':
      left = mousePosition.clientX - node.offsetWidth / 2
      top = mousePosition.clientY - 10
      break
    // opt.createBehavior === center
    default:
      left = window.document.body.offsetWidth / 2 - node.offsetWidth / 2
      top = window.document.body.offsetHeight / 2 - node.offsetHeight / 2
      break
  }
  top = top < opt.marginTop ? opt.marginTop : top

  node.style.position = 'fixed'
  node.style.top = `${top}px`
  node.style.left = `${left}px`
  node.style.userSelect = 'none'
}

function parseCSSTransform(transform: string): number[] {
  let xy = [0, 0]
  if (transform) {
    let str = transform.replace('translate(', '')
    str = str.replace(')', '')
    xy = str
      .split(',')
      .map(a => a.trim())
      .map(parseFloat)
  }
  return xy
}

/**
 * Attach listeners to the grip element to drag the node.
 */
function attachMouseHandlers(
  node: HTMLElement,
  grip: HTMLElement,
  opt?: {
    marginTop?: number
  }
) {
  opt = opt || {}
  opt.marginTop = opt.marginTop || 0

  function onmousemove(evt: MouseEvent) {
    let xy = parseCSSTransform(node.style.transform)
    xy = [(xy[0] || 0) + evt.movementX, (xy[1] || 0) + evt.movementY]
    node.style.transform = `translate(${xy[0]}px, ${xy[1]}px)`
  }

  function onmouseup() {
    const xy = parseCSSTransform(node.style.transform)
    node.style.transform = `unset`
    node.style.top = `${Math.max(
      parseFloat(node.style.top) + xy[1],
      opt.marginTop
    )}px`
    node.style.left = `${parseFloat(node.style.left) + xy[0]}px`

    window.removeEventListener('mousemove', onmousemove)
    window.removeEventListener('mouseup', onmouseup)
  }

  function onmousedown(evt: MouseEvent) {
    if (grip.contains(evt.target as HTMLElement)) {
      window.addEventListener('mousemove', onmousemove)
      window.addEventListener('mouseup', onmouseup)
    }
  }

  grip.addEventListener('mousedown', onmousedown)

  // teardown
  return () => {
    grip.removeEventListener('mousedown', onmousedown)
    window.removeEventListener('mousemove', onmousemove)
    window.removeEventListener('mouseup', onmouseup)
  }
}

export declare interface WindowManager {
  on(event: 'update', listener: () => void): void
  on(event: string, listener: Function): this
}

/**
 * Window Manager
 *
 * Manage the z-index style for a stack of HTMLElements.
 *
 * const windowManager = new WindowManager()
 * windowManager.focus(node)
 * if (showWindow) {
 *    setInitialWindowPosition(node)
 *    const { destroy } = createDragToMoveHandlers(node, grip)
 * }
 */
export class WindowManager extends EventEmitter {
  // top of stack is back
  stack: [HTMLElement, Function][] = []
  // starting z-index
  // ex.
  // stack[0] = 50
  // stack[1] = 51
  // etc...
  baseZIndex = 50
  anchor: HTMLElement = window.document.body

  constructor() {
    super()
    this.on('update', this.#onupdate)
  }

  /**
   * Always update the z-index of every stack HTMLElement on updates to
   * WindowManager.
   */
  #onupdate = () => {
    this.stack.forEach(([el], idx) => {
      el.style.zIndex = String(idx + this.baseZIndex)
    })
  }

  setAnchor(el: HTMLElement) {
    this.anchor = el
  }

  /**
   * Get the z-index of a given stack element return undefined if element is not
   * in the stack.
   */
  getZIndex(el: HTMLElement): number | undefined {
    const idx = this.stack.findIndex(arg => arg[0] === el)
    if (idx === -1) {
      return undefined
    }
    return this.baseZIndex + idx
  }

  /**
   * Adds item to the top of the stack. Finds in stack if it already exists else
   * it creates it.
   */
  upsert = (
    el: HTMLElement,
    grip: HTMLElement,
    opt?: {
      /**
       * Control where to position the window upon creation.
       *
       *  center:
       *    center of anchor
       *  undercursor:
       *    centered under cursor
       */
      createBehavior?: 'center' | 'undercursor'
      // Bound the top position to not go above this
      marginTop?: number
    }
  ) => {
    const found = this.stack.find(arg => arg[0] === el)
    if (found) {
      // it exists so move it to the front of the stack
      this.remove(found[0])
      this.stack.push(found)
    } else {
      renderInitialWindow(el, opt)
      const teardown = attachMouseHandlers(el, grip, opt)
      this.stack.push([el, teardown])
    }

    this.emit('update')
  }
  // alias
  focus = this.upsert

  remove(el: HTMLElement) {
    const idx = this.stack.findIndex(arg => arg[0] === el)
    const found = this.stack[idx]
    if (idx > -1) {
      found[1]()
      this.stack.splice(idx, 1)
    }

    this.emit('update')
  }
}

export const windowManager = new WindowManager()
