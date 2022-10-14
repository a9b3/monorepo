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
