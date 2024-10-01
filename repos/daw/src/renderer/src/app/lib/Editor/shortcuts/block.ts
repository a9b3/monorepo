import { createTextBlock, createListItemBlock } from '../utils'
import { Editor } from '../../../types/editor'

export default (editor: Editor) => ({
  title: 'Block Commands',
  context: 'blockCommands',
  description: 'Shortcuts for block commands',
  shortcuts: [
    {
      key: 'meta+Enter',
      title: 'Insert Block (Below Current)',
      description: 'Insert a new block below the current block',
      action: () => {
        editor.addRelativeToFocusedBlock(createTextBlock(), 'below')
      },
      preventDefault: true,
      stopPropagation: true
    },
    {
      key: 'shift+meta+Enter',
      title: 'Insert Block (Above Current)',
      description: 'Insert a new block above the current block',
      action: () => {
        editor.addRelativeToFocusedBlock(createTextBlock(), 'above')
      },
      preventDefault: true,
      stopPropagation: true
    },
    // {
    //   key: 'Backspace',
    //   title: 'Delete Block',
    //   description: 'Delete the current block if it is empty',
    //   action: (e) => {
    //     if (editor.getCurrentBlock()?.properties.text === '') {
    //       editor.deleteBlock(editor.currentBlockId)
    //
    //       e.preventDefault()
    //       e.stopPropagation()
    //     }
    //   }
    // },
    {
      key: 'Enter',
      title: 'Insert New Line',
      description:
        'Insert a new line in the current block for Header and Text blocks, or a new list item for List blocks',
      action: (e) => {
        const curBlock = editor.getCurrentBlock()
        if (['header', 'text'].includes(curBlock?.type || '')) {
          editor.addRelativeToFocusedBlock(createTextBlock(), 'below')

          e.preventDefault()
          e.stopPropagation()
        } else if (curBlock?.type === 'listItem') {
          editor.addRelativeToFocusedBlock(
            createListItemBlock(curBlock.properties.listType, curBlock.properties.indentLevel),
            'below'
          )

          e.preventDefault()
          e.stopPropagation()
        }
      }
    }
  ]
})
