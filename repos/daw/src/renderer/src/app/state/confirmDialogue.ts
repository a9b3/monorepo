import EventEmitter from 'events'

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
