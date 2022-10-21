import { findFirstAncestor, findAllAncestors } from 'src/utils'

type Boundary = {
  root: string
  key: string
  el: HTMLElement
}

/**
 * User wants to perform an action exclusive to their current boundary.
 * A boundary is a wrapper around a subtree.
 * A active boundary can exist.
 * Active boundary can be set whenever user performs an interaction e.g.
 * mousedown, which can propogate up to it's nearest boundary boundary.
 *
 * This active boundary can then be referenced upon actions that need to be
 * boundary aware.
 *
 * Boundaries can be nested, for example if you have a Backspace keyboard
 * handler that will delete midinotes in the arrangement track but delete clips
 * in the arrangement view. You want to be able to determine in which boundary
 * the user's event is originating from so you don't delete clips when they
 * meant to delete notes.
 *
 * This will work by establishing a tree by wrapping dom subtrees with a
 * Boundary component. This will register the boundary with an instance of
 * BoundaryManager.
 *
 * BoundaryManager will handle listening to all mousedown events do it registers
 * the last boundary as the active boundary.
 *
 * Other services can then refer to the BoundaryManager instance to see if they
 * should invoke their handlers.
 */
export class BoundaryManager {
  rootKey: string | undefined
  activeBoundary: Boundary | undefined
  rootAttr = 'data-boundary-root'
  keyAttr = 'data-boundary-key'

  constructor(rootKey: string) {
    this.rootKey = rootKey
  }

  get currentBoundaryKey() {
    return this.activeBoundary?.key
  }

  /**
   * Parse the element for it's boundary data. If none exists return undefined.
   */
  #getBoundaryData(el: HTMLElement): Boundary | undefined {
    const root = el.getAttribute(this.rootAttr)
    const key = el.getAttribute(this.keyAttr)
    if (!root || root !== this.rootKey) {
      return undefined
    }

    return {
      el,
      key,
      root,
    }
  }

  /**
   * This should always be triggered for the event type the boundary is intended
   * for and this should update the activeBoundary instance field.
   */
  #eventHandler = (evt: MouseEvent) => {
    if (!evt.target) {
      return
    }
    this.activeBoundary = this.getEventBoundary(evt.target as HTMLElement)
  }

  startListener() {
    window.addEventListener('mousedown', this.#eventHandler)
  }

  stopListener() {
    window.removeEventListener('mousedown', this.#eventHandler)
  }

  /**
   * Returns the first found boundary from the origin event.
   */
  getEventBoundary(target: HTMLElement): Boundary | undefined {
    // Scan up the tree of the origin event until the first boundary of it's
    // type is found.
    const firstBoundary = findFirstAncestor(target, t => {
      for (let i = 0; i < t.children.length; i += 1) {
        const child = t.children.item(i)
        if (child.getAttribute(this.rootAttr) === this.rootKey) {
          return child as HTMLElement
        }
      }
      return undefined
    })

    if (!firstBoundary) {
      return undefined
    }
    return this.#getBoundaryData(firstBoundary)
  }

  /**
   * Return entire chain of boundaries from origin element.
   */
  getEventBoundaryParents(target: HTMLElement): Boundary[] {
    if (!target) {
      return []
    }
    const ancestors = findAllAncestors(target, t => {
      if (!t) {
        return undefined
      }
      for (let i = 0; i < t.children.length; i += 1) {
        const child = t.children.item(i)
        if (child.getAttribute(this.rootAttr) === this.rootKey) {
          return this.#getBoundaryData(child as HTMLElement)
        }
      }
      return undefined
    })
    return ancestors.reverse()
  }
}
