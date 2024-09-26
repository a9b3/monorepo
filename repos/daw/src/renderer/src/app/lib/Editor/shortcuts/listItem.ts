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
        console.log(`curBlock: ${curBlock}`, curBlock.properties)
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
    },
    {
      key: 'Tab',
      title: 'Indent List Item',
      description: 'Indent the current list item',
      action: (e) => {
        const curBlock = editor.getCurrentBlock()

        let nextIndentLevel = curBlock?.properties.indentLevel
        const prevBlock = editor.getPreviousBlockFrom(curBlock?.id)
        if (prevBlock?.type === 'listItem') {
          nextIndentLevel =
            nextIndentLevel + 1 < prevBlock.properties.indentLevel + 2
              ? nextIndentLevel + 1
              : prevBlock.properties.indentLevel + 1
        } else {
          nextIndentLevel = 1
        }

        editor.updateBlock(curBlock?.id, {
          properties: {
            indentLevel: nextIndentLevel
          }
        })

        e.preventDefault()
        e.stopPropagation()
      }
    },
    {
      key: 'shift+Tab',
      title: 'Outdent List Item',
      description: 'Outdent the current list item',
      action: (e) => {
        const curBlock = editor.getCurrentBlock()

        let nextIndentLevel = curBlock?.properties.indentLevel
        const prevBlock = editor.getPreviousBlockFrom(curBlock?.id)
        if (prevBlock?.type === 'listItem') {
          nextIndentLevel = nextIndentLevel - 1 > 0 ? nextIndentLevel - 1 : 1
        } else {
          nextIndentLevel = 0
        }

        editor.updateBlock(curBlock?.id, {
          properties: {
            indentLevel: nextIndentLevel
          }
        })

        e.preventDefault()
        e.stopPropagation()
      }
    }
  ]
})
