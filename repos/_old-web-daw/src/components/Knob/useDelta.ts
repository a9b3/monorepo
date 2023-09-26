export function useDelta(
  getDelta: (delta: number) => void,
  opts: { pxRange: number }
) {
  return function handler(node: HTMLElement) {
    let currentY: number

    const mousemove = (evt: MouseEvent) => {
      const pxDelta = currentY - evt.clientY
      currentY = evt.clientY
      const percentageDelta = pxDelta / opts.pxRange
      getDelta(percentageDelta)
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
