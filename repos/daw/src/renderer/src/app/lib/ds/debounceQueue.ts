export default class DebounceQueue {
  queue: (() => Promise<any>)[] = []
  wait: number
  #timeout: NodeJS.Timeout | null = null
  #processing: boolean = false

  constructor(wait: number = 50) {
    this.wait = wait
  }

  add(fn: () => Promise<any>) {
    this.#debounce(() => {
      this.queue.push(fn)
      this.#processQueue()
    })
  }

  #debounce(fn: () => void) {
    if (this.#timeout) {
      clearTimeout(this.#timeout)
    }
    this.#timeout = setTimeout(() => {
      fn()
    }, this.wait)
  }

  #processQueue = async () => {
    if (this.#processing) return
    this.#processing = true

    while (this.queue.length > 0) {
      const fn = this.queue.shift()
      if (fn) {
        await fn()
      }
    }

    this.#processing = false
  }
}
