import type { Block } from '@renderer/src/app/types/block'

function deepUpdateBlock(path: string, value: any, block: Block) {
  const keys = path.split('.')
  let current = block
  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]]
  }
  current[keys[keys.length - 1]] = value
}

export default {
  deepUpdateBlock
}
