export function url(node: HTMLElement, onEdit: (el: HTMLElement) => void) {
  let selectionRange: Range | null = null

  function handleSelectionChange() {
    const selection = document.getSelection()
    if (!selection) return
    if (selection.rangeCount > 0) {
      selectionRange = selection.getRangeAt(0)
    }
  }

  function handleKeyDown(event) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault()
      openLinkPopup()
    }
  }

  function handlePaste(event) {
    event.preventDefault()
    const text = event.clipboardData.getData('text/plain')
    if (isValidUrl(text)) {
      insertLink(text, text)
    } else {
      document.execCommand('insertText', false, text)
    }
  }

  function openLinkPopup() {
    const selection = window.getSelection()
    if (selection.rangeCount > 0) {
      selectionRange = selection.getRangeAt(0)
      linkText = selectionRange.toString()
      linkUrl = ''
      linkPopup.style.display = 'block'
    }
  }

  function insertLink(url, text) {
    const linkElement = document.createElement('a')
    linkElement.href = url
    linkElement.textContent = text
    linkElement.style.color = '#1a0dab'
    linkElement.style.textDecoration = 'underline'

    if (selectionRange) {
      selectionRange.deleteContents()
      selectionRange.insertNode(linkElement)
    } else {
      editorDiv.appendChild(linkElement)
    }

    closeLinkPopup()
  }

  function closeLinkPopup() {
    linkPopup.style.display = 'none'
    linkText = ''
    linkUrl = ''
  }

  function isValidUrl(string) {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  // document.addEventListener('selectionchange', handleSelectionChange)
  // node.addEventListener('keydown', handleKeyDown)
  // node.addEventListener('paste', handlePaste)

  return {
    destroy() {
      // document.removeEventListener('selectionchange', handleSelectionChange)
    },
  }
}
