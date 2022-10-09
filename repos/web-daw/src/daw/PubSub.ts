import { EventEmitter } from 'events'

export class PubSub extends EventEmitter {
  subscribe = (listener: (state: this) => void) => {
    listener(this)
    const invokeListener = () => {
      listener(this)
    }
    this.on('update', invokeListener)

    return () => {
      this.removeListener('update', invokeListener)
    }
  }
}
