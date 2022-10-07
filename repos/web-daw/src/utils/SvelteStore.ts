/**
 * Extend this to make class a svelte store. Not a fan of svelte's pub sub API
 * why not use EventEmitters.
 *
 * https://monad.fi/en/blog/svelte-custom-stores/
 */
export class SvelteStore {
  svelteStore = []

  subscribe(listener: (state: this) => void) {
    this.svelteStore.push(listener)
    // Typescript throws an error here and svelte requires the initial set to be
    // called.
    listener(this)

    return () => {
      const idx = this.svelteStore.indexOf(listener)
      if (idx !== -1) {
        this.svelteStore.splice(idx, 1)
      }
    }
  }

  updareSvelte(state: this) {
    this.svelteStore.forEach(s => s(state))
  }
}
