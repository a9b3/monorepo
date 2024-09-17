type Callback<T = any> = (value: T) => void
type WildcardCallback = (change: { path: string; value: any }) => void

class PubSub {
  // Define subscribers and wildcard subscribers
  private subscribers: Map<string, Set<Callback>>
  private wildCardSubscribers: Set<WildcardCallback>

  constructor() {
    // Initialize subscribers and wildcard subscribers
    this.subscribers = new Map()
    this.wildCardSubscribers = new Set()
  }

  // Method to subscribe to a path
  subscribe<T = any>(path: string, callback: Callback<T>): void {
    if (path === '*') {
      // If path is wildcard, add to wildcard subscribers
      this.wildCardSubscribers.add(callback as WildcardCallback)
    } else {
      // If path is not wildcard, add to subscribers
      if (!this.subscribers.has(path)) {
        this.subscribers.set(path, new Set())
      }
      this.subscribers.get(path)!.add(callback)
    }
  }

  // Method to unsubscribe from a path
  unsubscribe<T = any>(path: string, callback: Callback<T>): void {
    if (path === '*') {
      // If path is wildcard, remove from wildcard subscribers
      this.wildCardSubscribers.delete(callback as WildcardCallback)
    } else if (this.subscribers.has(path)) {
      // If path is not wildcard, remove from subscribers
      this.subscribers.get(path)!.delete(callback)
      if (this.subscribers.get(path)!.size === 0) {
        this.subscribers.delete(path)
      }
    }
  }

  // Private method to notify subscribers of a path
  private notify<T = any>(path: string, value: T): void {
    if (this.subscribers.has(path)) {
      // If path has subscribers, notify them
      this.subscribers.get(path)!.forEach((callback) => callback(value))
    }
    // Notify wildcard subscribers
    this.wildCardSubscribers.forEach((callback) => callback({ path, value }))
  }

  // Method to create a proxy for an object
  createProxy<T extends object>(target: T, path: string = ''): T {
    const handler: ProxyHandler<T> = {
      get: (obj: T, prop: string | symbol): any => {
        let value = Reflect.get(obj, prop)
        const newPath = path ? `${path}.${String(prop)}` : String(prop)

        if (value === undefined) {
          // If value is undefined, return undefined
          return undefined
        }

        if (typeof value === 'object' && value !== null) {
          // If value is an object, create a proxy for it
          return this.createProxy(value, newPath)
        }

        return value
      },
      set: (obj: T, prop: string | symbol, value: any): boolean => {
        const oldValue = Reflect.get(obj, prop)
        const result = Reflect.set(obj, prop, value)
        const newPath = path ? `${path}.${String(prop)}` : String(prop)

        if (oldValue !== value) {
          // If value has changed, notify subscribers
          this.notify(newPath, value)
        }

        return result
      }
    }

    // Return a new proxy for the target object
    return new Proxy(target, handler)
  }
}

export default PubSub
