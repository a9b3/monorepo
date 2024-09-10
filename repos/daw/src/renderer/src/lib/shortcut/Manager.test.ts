import ShortcutManager from './Manager'
import { JSDOM } from 'jsdom'
import type { DOMWindow } from 'jsdom'

function dispatchEvent(opt: KeyboardEventInit) {
  const event = new window.KeyboardEvent('keydown', opt)
  window.dispatchEvent(event)
}

describe('ShortcutManager', () => {
  let dom: JSDOM
  let window: DOMWindow
  let document: Document

  beforeEach(() => {
    dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`, {
      url: 'http://localhost',
      runScripts: 'dangerously'
    })
    window = dom.window
    document = window.document
    // @ts-ignore:  global doesn't include window properties
    global.window = window
    global.document = document
  })

  afterEach(() => {
    delete global.window
    delete global.document
  })

  test('constructor', () => {
    const manager = new ShortcutManager()
    expect(manager).toBeInstanceOf(ShortcutManager)
  })

  test('register shortcut', () => {
    const context = 'test'
    const action = jest.fn()
    const key = 'ctrl+a'

    const manager = new ShortcutManager()
    manager.register({
      context,
      title: 'Test',
      description: 'Test',
      shortcuts: [{ key, action }]
    })

    dispatchEvent({ ctrlKey: true, key: 'a' })
    expect(action).toHaveBeenCalledTimes(0)

    manager.pushActiveContext(context)

    dispatchEvent({ ctrlKey: true, key: 'a' })
    expect(action).toHaveBeenCalled()

    dispatchEvent({ key: 'a' })
    expect(action).toHaveBeenCalledTimes(1)
  })
})
