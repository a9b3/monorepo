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

export function createListItemBlock(listType: string, indentLevel: number) {
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
