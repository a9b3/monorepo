export function useDelta(onDeltaChange: (arg: { x: number; y: number }) => void) {
  return function handler(node: HTMLElement) {
    let currentY: number
    let currentX: number

    const mousemove = (evt: MouseEvent) => {
      const pxDeltaY = currentY - evt.clientY
      const pxDeltaX = currentX - evt.clientX

      currentY = evt.clientY
      currentX = evt.clientX

      onDeltaChange({ x: pxDeltaX, y: pxDeltaY })
    }

    const mouseup = () => {
      document.removeEventListener('mousemove', mousemove)
      document.removeEventListener('mouseup', mouseup)
    }

    const mousedown = (evt: MouseEvent) => {
      if (!node.contains(evt.target)) {
        return
      }
      currentY = evt.clientY
      currentX = evt.clientX

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
      }
    }
  }
}
