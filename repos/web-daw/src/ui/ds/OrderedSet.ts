/**
 * OrderedSet for O(1) last() functionality which might be used more often than
 * inserts/removals.
 */
export class OrderedSet extends Set {
  #orderedSet = []

  order() {
    return this.#orderedSet
  }

  last() {
    return this.#orderedSet[this.#orderedSet.length - 1]
  }

  clear() {
    this.#orderedSet = []
    return super.clear()
  }

  prepend(value: any) {
    if (this.has(value)) {
      const idx = this.#orderedSet.indexOf(value)
      this.#orderedSet.splice(idx, 1)
    }
    this.#orderedSet.unshift(value)

    return super.add(value)
  }

  add(value: any) {
    if (this.has(value)) {
      const idx = this.#orderedSet.indexOf(value)
      this.#orderedSet.splice(idx, 1)
    }
    this.#orderedSet.push(value)

    return super.add(value)
  }

  delete(value: any): boolean {
    if (this.has(value)) {
      const idx = this.#orderedSet.indexOf(value)
      this.#orderedSet.splice(idx, 1)
    }

    return super.delete(value)
  }
}
