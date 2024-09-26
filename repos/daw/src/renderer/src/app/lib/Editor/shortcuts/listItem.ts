import { createTextBlock, createListItemBlock } from '../utils'
import { Editor } from '../../../types/editor'

export default (editor: Editor) => ({
  title: 'List Item Commands',
  context: 'listItemCommands',
  description: 'Shortcuts for list item block commands',
  shortcuts: [
    {
      key: 'Enter',
      title: 'Insert New List Item',
      description: 'Insert a new list item in the current list block for List Item blocks',
      action: (e) => {
        const curBlock = editor.getCurrentBlock()
        if (curBlock.properties.text === '') {
          editor.deleteBlock(editor.currentBlockId)
          editor.addRelativeToFocusedBlock(createTextBlock(), 'below')
          editor.addRelativeToFocusedBlock(createTextBlock(), 'below')
        } else {
          editor.addRelativeToFocusedBlock(
            createListItemBlock(curBlock.properties.listType, curBlock.properties.indentLevel),
            'below'
          )
        }

        e.preventDefault()
        e.stopPropagation()
      }
    }
  ]
})
