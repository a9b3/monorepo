import { Subscribable } from 'daw/core'

class SelectorStore extends Subscribable {
  selecting = false
  selected: any = {}
  selectable: {
    el: HTMLElement
    id: string
  }[] = []
}

export const selectorStore = new SelectorStore()

export function setSelecting(selecting: boolean) {
  selectorStore.selecting = selecting
  selectorStore.emit('update')
}

export function createSelectable(id: string) {
  return function selectableDirective(node: HTMLElement) {
    const idx = selectorStore.selectable.findIndex(({ el }) => el === node)
    if (idx === -1) {
      selectorStore.selectable.push({
        el: node,
        id,
      })
    }
    selectorStore.emit('update')

    return {
      destroy() {
        const _idx = selectorStore.selectable.findIndex(({ el }) => el === node)
        if (_idx !== 1) {
          selectorStore.selectable.splice(_idx, 1)
          selectorStore.emit('update')
        }
      },
    }
  }
}
