function offset(target, x = 0, y = 0) {
  if (!target) {
    return { x, y }
  }

  console.log(target, target.offsetTop, target.scrollTop)
  return offset(
    target.offsetParent,
    x + target.offsetLeft + target.scrollLeft,
    y + target.offsetTop + target.scrollTop
  )
}

offset(temp3)

// function relativeOffset(origin, container) {
//   const originXY = offset(origin)
//   const containerXY = offset(container)
//
//   console.log(`originXY`, originXY)
//   console.log(`containerXY`, containerXY)
//   return {
//     x: originXY.x - containerXY.x,
//     y: originXY.y - containerXY.y,
//   }
// }
//
// relativeOffset(temp3, temp4)
