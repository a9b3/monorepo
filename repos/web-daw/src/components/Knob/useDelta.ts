/**
 * Place on a dom element to use the origin click event handler.
 */
export function useDelta(getDelta: (arg: { x: number; y: number }) => void) {
  return function handler(node: HTMLElement) {
    let curX = 0
    let curY = 0

    const mousemove = (evt: MouseEvent) => {
      window.requestAnimationFrame(() => {
        getDelta({ x: curX + evt.movementX, y: curY + evt.movementY })
        curX = evt.movementX
        curY = evt.movementY
      })
    }

    const mouseup = () => {
      document.body.style.cursor = 'default'
      document.removeEventListener('mousemove', mousemove)
      document.removeEventListener('mouseup', mouseup)
    }

    const mousedown = (evt: MouseEvent) => {
      document.body.style.cursor = 'ns-resize'
      if (!node.contains(evt.target as HTMLElement)) {
        return
      }
      curX = 0
      curY = 0

      document.addEventListener('mousemove', mousemove)
      document.addEventListener('mouseup', mouseup)
    }

    node.addEventListener('mousedown', mousedown)

    return {
      destroy() {
        node.removeEventListener('mousedown', mousedown)
        // Just in case also remove the following two
        document.removeEventListener('mousemove', mousemove)
        document.removeEventListener('mouseup', mouseup)
      },
    }
  }
}
