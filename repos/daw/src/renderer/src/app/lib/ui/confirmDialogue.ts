import EventEmitter from 'events'

/**
 * A simple confirm dialogue that can be used to ask the user to confirm an action.
 *
 * Implement in your component like this:
 * ```tsx
 * import confirmDialogue from './confirmDialogue'
 *
 * confirmDialogue.on('show', ({ message, onConfirm, onCancel }) => {
 *  // Show your own modal or whatever
 *  // Call onConfirm() or onCancel() when the user confirms or cancels
 *  // Make sure to call confirmDialogue.hide() when the modal is closed
 *  // to clean up the event listeners
 *  })
 */
class ConfirmDialogue {
  emitter = new EventEmitter()

  show(opts: { message: string; onConfirm: () => void; onCancel: () => void }) {
    this.emitter.emit('show', opts)
  }

  hide() {
    this.emitter.emit('hide')
  }

  on(event: 'show' | 'hide', listener: (...args: any[]) => void) {
    this.emitter.on(event, listener)
  }

  off(event: 'show' | 'hide', listener: (...args: any[]) => void) {
    this.emitter.off(event, listener)
  }
}

const confirmDialogue = new ConfirmDialogue()

export default confirmDialogue
