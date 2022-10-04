/**
 * Extend this to make class a svelte store. Not a fan of svelte's pub sub API
 * why not use EventEmitters.
 *
 * https://monad.fi/en/blog/svelte-custom-stores/
 */
export class SvelteStore<T> {
  _svelteStoreListeners = []

  subscribe(listener: (state: T) => void) {
    this._svelteStoreListeners.push(listener)
    // Typescript throws an error here and svelte requires the initial set to be
    // called.
    listener(this as any)

    return () => {
      const idx = this._svelteStoreListeners.indexOf(listener)
      if (idx !== -1) {
        this._svelteStoreListeners.splice(idx, 1)
      }
    }
  }

  set(state: T) {
    this._svelteStoreListeners.forEach(s => s(state))
  }
}
