/**
 * If you have a tree like this you only want the closest parent to trigger then
 * use this function to determine if you are in the direct subtree.
 *
 *    instanceof type Foo
 *
 *    instanceof type Foo   <--- only this should trigger
 *
 *    evt node
 *
 *
 *  predicate:
 *    return true if el is instanceof type target
 */
export function directSubtreeOf(
  node: HTMLElement,
  target: HTMLElement,
  predicate: (el: Element) => boolean
): boolean {
  if (node === window.document.body) {
    return false
  }
  for (let i = 0; i < node.parentElement.children.length; i += 1) {
    const el = node.parentElement.children.item(i)
    if (el === target) {
      return true
    }
    if (predicate(el)) {
      return false
    }
  }
  return directSubtreeOf(node.parentElement, target, predicate)
}

export function findFirstAncestor(
  node: HTMLElement,
  predicate: (el: Element) => boolean
) {
  if (node === window.document.body) {
    return false
  }
  if (predicate(node.parentElement)) {
    return node.parentElement
  }
  return findFirstAncestor(node.parentElement, predicate)
}

export function getScrollParent(element: HTMLElement, includeHidden?: boolean) {
  let style = getComputedStyle(element)
  let excludeStaticParent = style.position === 'absolute'
  let overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/

  if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX))
    return element

  if (style.position === 'fixed') return document.body
  for (let parent = element; (parent = parent.parentElement); ) {
    style = getComputedStyle(parent)
    if (excludeStaticParent && style.position === 'static') {
      continue
    }
    if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX))
      return parent
  }

  return document.body
}
