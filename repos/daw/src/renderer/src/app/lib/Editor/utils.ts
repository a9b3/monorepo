import type { ListItem } from '../../types/block'

export function createTextBlock() {
  return {
    id: window.crypto.randomUUID(),
    type: 'text' as 'text',
    properties: {
      text: ''
    },
    children: [],
    lastModified: new Date().toISOString()
  }
}

export function createListItemBlock(
  listType: ListItem['properties']['listType'],
  indentLevel: number
): ListItem {
  return {
    id: window.crypto.randomUUID(),
    type: 'listItem' as 'listItem',
    properties: {
      text: '',
      listType,
      indentLevel,
      checked: false
    },
    children: [],
    lastModified: new Date().toISOString()
  }
}
