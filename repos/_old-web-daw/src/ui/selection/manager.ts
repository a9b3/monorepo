import { EventEmitter } from 'events'
import { getScrollParent } from 'src/utils'
import { zindex } from '../zindex'
import { getElementRect } from 'src/components/PianoRoll/midiGuiUtils'

export enum ModKeys {
  Ctrl = 'ctrlKey',
  Shift = 'shiftKey',
  Meta = 'metaKey',
  Alt = 'altKey',
}

type Rect = {
  top: number
  left: number
  right: number
  bottom: number
}

/**
 * Use to snap to grid.
 *
 */
function snapToGrid(
  value: number,
  division: number,
  opt?: { floor?: boolean; tolerance?: number }
) {
  opt = opt || {}
  opt.floor = opt.floor || true

  if (opt.tolerance && Math.abs(value % division) > division * opt.tolerance) {
    return value
  }

  if (opt.floor) {
    const sign = Math.sign(value)
    return Math.floor(Math.abs(value / division)) * division * sign
  }

  return Math.round(value / division) * division
}

function intersectRect(r1: Rect, r2: Rect) {
  return !(
    r2.left > r1.right ||
    r2.right < r1.left ||
    r2.top > r1.bottom ||
    r2.bottom < r1.top
  )
}

function parseCSSTransform(transform: string): number[] {
  let xy = [0, 0, 0, 0, 0, 0]
  if (transform.startsWith('matrix')) {
    let str = transform.replace('matrix(', '')
    str = str.replace(')', '')
    xy = str
      .split(',')
      .map(a => a.trim())
      .map(parseFloat)
    return xy
  }
  if (transform.startsWith('translate(')) {
    let str = transform.replace('translate(', '')
    str = str.replace(')', '')
    xy = str
      .split(',')
      .map(a => a.trim())
      .map(parseFloat)
    return xy
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
   * Attr to identify a dom node as a selection container. Used internally to
   * detect whether events originated from direct subtree of a Selection
   * container.
   */
  #attrKey = 'data-selection-component-type'
  #attrVal = 'selector'

  /**
   * The container in which selection can occur. This container must be position
   * relative.
   */
  container: HTMLElement
  /**
   * The scroll parent that this container belongs to or this container by
   * default.
   */
  scrollParent: HTMLElement
  /**
   * The selectable elements within the container. Set by calling
   * registerSelectable.
   */
  selectable: { [id: string]: { el: HTMLElement; id: string } } = {}
  /**
   * Reference to currently selected elements.
   */
  selected: { [id: string]: HTMLElement } = {}
  /**
   * Reference to the HTMLElement created to display the selection box.
   */
  sbox: HTMLElement

  /**
   * onmousedown tracking of mouse position origin
   */
  #origin = {
    x: 0,
    y: 0,
  }
  /**
   * If set requires mod key to activate selection.
   */
  modKey: ModKeys | undefined
  /**
   * mod + mousedown will activate multi select.
   */
  multiSelectModKey: ModKeys

  constructor() {
    super()
    this.setMaxListeners(200)
  }

  registerContainer(
    container: HTMLElement,
    opt?: { modKey?: ModKeys; multiSelectModKey?: ModKeys }
  ) {
    opt = opt || {}
    opt.multiSelectModKey = opt.multiSelectModKey || ModKeys.Shift

    this.modKey = opt.modKey
    this.multiSelectModKey = opt.multiSelectModKey

    this.container = container
    // This is used to scan up the tree for a given element to see which
    // container evt originated from.
    // ex. stop at first parent selector and compare to see if it matches
    // container reference
    this.container.setAttribute(this.#attrKey, this.#attrVal)
    this.container.addEventListener('mousedown', this.#onmousedown)
    this.scrollParent = getScrollParent(this.container)
    window.addEventListener('mousedown', this.#windowmousedown)
  }
  ensureContainerRegistered() {
    if (!this.container) {
      throw new Error(`Must register a html with 'registerContainer' first.`)
    }
  }

  unregisterContainer() {
    this.ensureContainerRegistered()
    this.container.removeEventListener('mousedown', this.#onmousedown)
    window.removeEventListener('mousemove', this.#onmousemove)
    window.removeEventListener('mousedown', this.#windowmousedown)
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

  setModKey(modKey?: ModKeys) {
    this.modKey = modKey
  }

  // -------------------------------------------------------------------------
  // Internals
  // -------------------------------------------------------------------------

  /**
   * Calculate against the scroll parent and container parent. Attemps to get
   * the x y position relative to the container element's origin x y.
   */
  #containerMouseXY(evt: MouseEvent) {
    const containerBound = this.container.getBoundingClientRect()
    return {
      x: this.container.scrollLeft + evt.clientX - containerBound.left,
      y: this.container.scrollTop + evt.clientY - containerBound.top,
    }
  }

  /**
   * Calculate the delta of the given mouse event against the origin mouse
   * event.
   */
  #containerDeltaMouseXY(evt: MouseEvent) {
    const pos = this.#containerMouseXY(evt)
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

    return {
      deltaX,
      deltaY,
    }
  }

  /**
   * Get the rect coords of the current selection box.
   */
  #selectionBoxRect() {
    const computedStyle = getComputedStyle(this.sbox)
    const transformxy = parseCSSTransform(computedStyle.transform)
    const y = transformxy.pop()
    const x = transformxy.pop()
    const offsetY = parseFloat(computedStyle.top) + y
    const offsetX = parseFloat(computedStyle.left) + x

    return {
      top: offsetY,
      left: offsetX,
      right: offsetX + parseFloat(computedStyle.width),
      bottom: offsetY + parseFloat(computedStyle.height),
    }
  }

  /**
   * Check if element is within the context of the current container.
   * Useful for detecting events within nested containers. You would only want
   * to allow selection in the most immediate container.
   *
   * ex.
   *
   * [container a]
   * [a] [b] [c] [container b]
   *             [d]  <--- only handled by container b not a
   *
   */
  #containerExclusive = (el: HTMLElement): boolean => {
    this.ensureContainerRegistered()

    if (['fixed'].includes(getComputedStyle(el).position)) {
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

  #calcTransformTranslate({ x, y }) {
    return `translate(${x}px, ${y}px)`
  }

  // -------------------------------------------------------------------------
  // Selection Logic
  // TODO move this to an separate class
  // -------------------------------------------------------------------------

  #selectedBound = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }

  /**
   * Detects if selectables are within the selection box. Updates this.selected
   * map.
   */
  #detectSelectableIntersections = (
    selectionBoxRect: Rect,
    multiSelect?: boolean
  ) => {
    Object.values(this.selectable).forEach(({ el, id }) => {
      const r2 = getElementRect(el, this.container)
      if (intersectRect(selectionBoxRect, r2)) {
        this.selected[id] = el
      } else if (!multiSelect) {
        delete this.selected[id]
      }
      this.#calcSelectedBound()
    })

    this.emit('update')
  }

  // TODO need to figure out how to maintain reference so this returns true
  #isSelectable(el: HTMLElement) {
    const id = el.getAttribute('data-midi-clip-id')
    return Object.keys(this.selectable).indexOf(id) > -1 ? id : false
  }
  // TODO need to figure out how to maintain reference so this returns true
  #isSelected(el: HTMLElement) {
    const id = el.getAttribute('data-midi-clip-id')
    return Object.keys(this.selected).indexOf(id) > -1
  }

  #resetSelectedBound() {
    this.#selectedBound = {
      top: Number.POSITIVE_INFINITY,
      left: Number.POSITIVE_INFINITY,
      right: Number.NEGATIVE_INFINITY,
      bottom: Number.NEGATIVE_INFINITY,
    }
  }

  #calcSelectedBound() {
    this.#resetSelectedBound()
    Object.keys(this.selected).forEach(id => {
      const selected = this.selectable[id]
      const r1 = getElementRect(
        selected.el,
        this.container,
        !selected.el.isConnected
      )
      this.#selectedBound.top = Math.min(r1.top, this.#selectedBound.top)
      this.#selectedBound.left = Math.min(r1.left, this.#selectedBound.left)
      this.#selectedBound.right = Math.max(r1.right, this.#selectedBound.right)
      this.#selectedBound.bottom = Math.max(
        r1.bottom,
        this.#selectedBound.bottom
      )
    })
  }

  // -------------------------------------------------------------------------
  // Move Selection Logic
  // TODO move this to an separate class
  // -------------------------------------------------------------------------

  allowOutOfBounds = false
  snapRow = undefined
  snapColumn = undefined

  #moving = false
  #movingOrigin = {}
  #movingOriginTarget: Rect
  #moveFinish = () => {}
  #onMove = ({ el, originX, originY, deltaX, deltaY }) => {
    return {
      x: originX + deltaX,
      y: originY + deltaY,
    }
  }

  #transformDelta = (arg0: {
    originRect: Rect
    selectedBound: Rect
    originX: number
    deltaX: number
    deltaY: number
  }): { deltaX: number; deltaY: number } => {
    if (this.snapRow) {
      arg0.deltaY = snapToGrid(arg0.deltaY, this.snapRow)
    }

    if (this.snapColumn) {
      arg0.deltaX = snapToGrid(arg0.deltaX, this.snapColumn, {
        tolerance: 0.3,
      })
    }

    // Calculate keep in bound deltas
    if (!this.allowOutOfBounds) {
      const bound = this.container.getBoundingClientRect()

      arg0.deltaY =
        arg0.selectedBound.top + arg0.deltaY < 0
          ? 0 - arg0.selectedBound.top
          : arg0.deltaY
      arg0.deltaY =
        arg0.selectedBound.bottom + arg0.deltaY > bound.height
          ? bound.height - arg0.selectedBound.bottom
          : arg0.deltaY
      arg0.deltaX =
        arg0.selectedBound.left + arg0.deltaX < 0
          ? 0 - arg0.selectedBound.left
          : arg0.deltaX
      arg0.deltaX =
        arg0.selectedBound.right + arg0.deltaX > bound.width
          ? bound.width - arg0.selectedBound.right
          : arg0.deltaX
    }

    return {
      deltaX: arg0.deltaX,
      deltaY: arg0.deltaY,
    }
  }

  setMoveFinish(moveFinish) {
    this.#moveFinish = moveFinish
  }

  removeMoveFinish() {
    this.#moveFinish = undefined
  }

  setOnMove(onMove) {
    this.#onMove = onMove
  }

  removeOnMove() {
    this.#onMove = undefined
  }

  #movingHandler = (evt: MouseEvent) => {
    const { deltaX, deltaY } = this.#containerDeltaMouseXY(evt)

    // Custom transform delta
    const { deltaX: transformedDeltaX, deltaY: transformedDeltaY } =
      this.#transformDelta({
        originRect: this.#movingOriginTarget,
        selectedBound: this.#selectedBound,
        deltaX,
        deltaY,
      })

    // Apply delta to all selected
    Object.keys(this.selected)
      .map(id => {
        return this.selectable[id]
      })
      .forEach(({ id, el }) => {
        const [originX, originY] = this.#movingOrigin[id]

        el.style.transform = this.#calcTransformTranslate({
          x: originX + transformedDeltaX,
          y: originY + transformedDeltaY,
        })
      })
  }

  setOnMoveFinish(moveFinish) {
    this.#moveFinish = moveFinish
  }

  #movingHandlerUp = () => {
    this.#moveFinish(
      Object.keys(this.selected).map(id => {
        const r1 = getElementRect(this.selectable[id].el, this.container)
        return {
          rect: r1,
          ...this.selectable[id],
        }
      })
    )
    this.#movingOrigin = {}
    this.#moving = false

    this.selected = {}
    this.#resetSelectedBound()
    this.emit('update')

    window.removeEventListener('mousemove', this.#movingHandler)
    window.removeEventListener('mouseup', this.#movingHandlerUp)
  }

  #startMoving = (target: HTMLElement) => {
    if (this.#isSelected(target)) {
      this.#moving = true
      this.#movingOriginTarget = getElementRect(
        target,
        this.container,
        !target.isConnected
      )
      this.#calcSelectedBound()

      // Set this.#movingOrigin origin xy for each selected item
      Object.keys(this.selected)
        .map(id => {
          return this.selectable[id]
        })
        .forEach(({ id, el }) => {
          this.#movingOrigin[id] = parseCSSTransform(el.style.transform)
        })

      window.addEventListener('mousemove', this.#movingHandler)
      window.addEventListener('mouseup', this.#movingHandlerUp)
      return true
    }
  }

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------

  /**
   * Clicking anywhere else should clear selection unless multi select is
   * active.
   */
  #windowmousedown = (evt: MouseEvent) => {
    this.ensureContainerRegistered()
    // Do not clear selected if trying to multi select
    if (this.multiSelectModKey && evt[this.multiSelectModKey]) {
      return
    }
    if (this.#moving) {
      return
    }
    // Clear selected
    this.selected = {}
    this.#resetSelectedBound()

    this.emit('update')
  }

  allowDirectSelectable = true

  /**
   * Sets initial selection box styles.
   *
   * This will always fire before windowmousedown since it's deeper in the tree.
   */
  #onmousedown = (evt: MouseEvent) => {
    this.ensureContainerRegistered()
    // Only process event if originated inside the container subtree.
    if (!this.#containerExclusive(evt.target as HTMLElement)) {
      return
    }
    const id = this.#isSelectable(evt.target as HTMLElement)

    // If mod key is required and not pressed then do nothing
    if (
      !(id && this.allowDirectSelectable) &&
      this.modKey &&
      !evt[this.modKey]
    ) {
      return
    }

    // if (this.modKey && !evt[this.modKey]) {
    //   this.selected = {}
    //   this.#resetSelectedBound()
    //   this.emit('update')
    // }

    // Set the origin
    this.#origin = this.#containerMouseXY(evt)

    if (id) {
      this.selected[id] = evt.target as HTMLElement
      this.emit('update')
    }
    if (
      Object.keys(this.selected).length > 0 &&
      this.#startMoving(evt.target as HTMLElement)
    ) {
      evt.stopPropagation()
      return
    }

    // Set selection box styles
    this.sbox.style.position = 'absolute'
    this.sbox.style.left = `${this.#origin.x}px`
    this.sbox.style.top = `${this.#origin.y}px`
    this.sbox.style.width = `0px`
    this.sbox.style.height = `0px`
    this.sbox.style.transform = `translate(0px, 0px)`
    this.sbox.style.border = `1px solid hsl(var(--hsl__accent-h), var(--hsl__accent-s), var(--hsl__accent-l), 1)`
    this.sbox.style.zIndex = zindex.selection

    window.addEventListener('mousemove', this.#onmousemove)
    window.addEventListener('mouseup', this.#onmouseup)
  }

  /**
   * Update selection box styles and detect selectable intersections.
   */
  #onmousemove = (evt: MouseEvent) => {
    this.ensureContainerRegistered()

    // If no longer holding down mod key then do nothing
    if (this.modKey && !evt[this.modKey]) {
      return
    }

    const { deltaX, deltaY } = this.#containerDeltaMouseXY(evt)

    // Set updated styles
    this.sbox.style.display = 'block'
    this.sbox.style.transform = `translate(${deltaX < 0 ? deltaX : 0}px, ${
      deltaY < 0 ? deltaY : 0
    }px)`
    this.sbox.style.width = `${Math.abs(deltaX)}px`
    this.sbox.style.height = `${Math.abs(deltaY)}px`

    // Set selectables
    this.#detectSelectableIntersections(
      this.#selectionBoxRect(),
      this.multiSelectModKey && evt[this.multiSelectModKey]
    )
  }

  /**
   * Remove selection box.
   */
  #onmouseup = () => {
    this.ensureContainerRegistered()
    this.sbox.style.display = 'none'

    window.removeEventListener('mousemove', this.#onmousemove)
    window.removeEventListener('mousemove', this.#movingHandler)
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
