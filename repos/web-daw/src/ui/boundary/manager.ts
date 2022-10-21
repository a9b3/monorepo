import { findFirstAncestor, findAllAncestors } from 'src/utils'
import { OrderedSet } from 'src/ui/ds/OrderedSet'

type Boundary = {
  key: string
  el: HTMLElement
}

/**
 *
 */
export class BoundaryManager {
  rootKey: string | undefined
  #orderedSet = new OrderedSet()
  #focusHistory = new OrderedSet()
  #elements: { [key: string]: Boundary } = {}
  rootAttr = 'data-boundary-root'
  keyAttr = 'data-boundary-key'

  constructor(rootKey: string) {
    this.rootKey = rootKey
  }

  get activeBoundary() {
    return this.#elements[this.#focusHistory.last()]
  }

  get currentBoundaryKey() {
    return this.activeBoundary?.key
  }

  /**
   * This should always be triggered for the event type the boundary is intended
   * for and this should update the activeBoundary instance field.
   */
  #eventHandler = (evt: MouseEvent) => {
    if (!evt.target) {
      return
    }
    const found = this.getEventBoundary(evt.target as HTMLElement)
    // Set activeBoundary
    if (found && this.#orderedSet.has(found.key)) {
      this.#focusHistory.add(found.key)
      this.#elements[found.key] = found
    }
  }

  startListener() {
    window.addEventListener('mousedown', this.#eventHandler)
  }

  stopListener() {
    window.removeEventListener('mousedown', this.#eventHandler)
  }

  /**
   * Parse the element for it's boundary data. If none exists return undefined.
   */
  #getAttr(el: HTMLElement): Boundary | undefined {
    const root = el.getAttribute(this.rootAttr)
    const key = el.getAttribute(this.keyAttr)
    if (!root || root !== this.rootKey) {
      return undefined
    }

    return {
      el,
      key,
    }
  }

  /**
   * Returns the first found boundary from the origin event.
   */
  getEventBoundary(target: HTMLElement): Boundary | undefined {
    const firstBoundary = findFirstAncestor(target, t => {
      return t.getAttribute(this.rootAttr) === this.rootKey ? t : undefined
    })

    if (!firstBoundary) {
      return undefined
    }

    return this.#getAttr(firstBoundary)
  }

  /**
   * Return entire chain of boundaries from origin element.
   */
  getEventBoundaryParents(target: HTMLElement): Boundary[] {
    if (!target) {
      return []
    }
    return findAllAncestors(target, t => {
      return t.getAttribute(this.rootAttr) === this.rootKey ? t : undefined
    }).map(t => this.#getAttr(t))
  }

  getActiveBoundaryPath(): Boundary[] {
    return this.getEventBoundaryParents(this.activeBoundary.el)
  }

  addBoundary(key: string, el: HTMLElement) {
    if (this.#orderedSet.has(key)) {
      throw new Error('Boundary keys must be unique.')
    }
    this.#orderedSet.add(key)
    this.#elements[key] = { el, key }
    this.#focusHistory.add(key)
  }

  deleteBoundary(key: string) {
    this.#orderedSet.delete(key)
    this.#focusHistory.delete(key)
    delete this.#elements[key]
  }
}
