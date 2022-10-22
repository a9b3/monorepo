import { OrderedSet } from 'src/ui/ds/OrderedSet'
import { findAllAncestors } from 'src/utils'

export interface MenuItem {
  type?: 'item' | 'divider' | 'label'
  handler?: () => void
  label?: string
  exclusive?: boolean
}

export interface MenuItemGroup {
  prepend?: boolean
  items: MenuItem[]
}

export class ContextMenuManager {
  #menuItemGroup: { [id: string]: MenuItemGroup } = {}
  idAttr = 'data-context-menu-id'
  switchAttr = 'data-context-menu-switch'

  buildCurrentMenu(evt: MouseEvent) {
    const foundIds = findAllAncestors(evt.target as HTMLElement, el => {
      const menuItemGroupId = el.getAttribute(this.idAttr)
      return menuItemGroupId
    })

    let buildMenu = []

    for (let i = 0; i < foundIds.length; i += 1) {
      const menuGroup = this.#menuItemGroup[foundIds[i]]

      const toAddItems = menuGroup.items.filter(item => {
        if (item.exclusive && i !== 0) {
          return false
        }
        return true
      })
      buildMenu = buildMenu.concat(toAddItems)
    }

    return buildMenu
  }

  add(id: string, menuItemGroup: MenuItemGroup) {
    this.#menuItemGroup[id] = menuItemGroup
  }

  delete(id: string) {
    delete this.#menuItemGroup[id]
  }
}
