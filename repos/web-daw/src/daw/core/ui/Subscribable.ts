import { EventEmitter } from 'events'

/**
 * Used to notify UI of changes. Implements the svelte subscribe API but you can
 * also just listen to the update event.
 */
export class Subscribable extends EventEmitter {
  static update = 'update'

  constructor() {
    super()
    this.setMaxListeners(1000)
  }

  /**
   * Svelte subscribe method.
   */
  subscribe = (listener: (state: this) => void) => {
    listener(this)

    const invokeListener = () => {
      listener(this)
    }

    this.on(Subscribable.update, invokeListener)

    return () => {
      this.removeListener(Subscribable.update, invokeListener)
    }
  }
}
