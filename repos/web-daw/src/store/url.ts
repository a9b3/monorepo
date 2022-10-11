import { derived, writable } from 'svelte/store'

/**
 * Svelte store to subscribe to url changes.
 */
export function createUrlStore(ssrUrl?: string) {
  // Ideally a bundler constant so that it's tree-shakable
  if (typeof window === 'undefined') {
    const { subscribe } = writable(ssrUrl)
    return { subscribe }
  }

  const href = writable(window.location.href)

  const originalPushState = window.history.pushState
  const originalReplaceState = window.history.replaceState

  const updateHref = () => href.set(window.location.href)

  window.history.pushState = function pushState(...args) {
    originalPushState.apply(this, args)
    updateHref()
  }

  window.history.replaceState = function replaceState(...args) {
    originalReplaceState.apply(this, args)
    updateHref()
  }

  window.addEventListener('popstate', updateHref)
  window.addEventListener('hashchange', updateHref)

  return {
    subscribe: derived(href, $href => new URL($href)).subscribe,
  }
}

const urlStore = createUrlStore()

export const url = derived([urlStore], ([$urlStore]) => {
  return new URL($urlStore)
})

// If you're using in a pure SPA, you can return a store directly and share it everywhere
export default urlStore
