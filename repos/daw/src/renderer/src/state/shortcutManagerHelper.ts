import shortcutManager from './shortcutManager'

export function shortcutManagerContext(_: HTMLElement, context: string) {
  shortcutManager.pushActiveContext(context)

  return {
    destroy() {
      shortcutManager.popActiveContext(context)
    }
  }
}
