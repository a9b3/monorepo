import { writable, derived } from 'svelte/store'

interface CaseT {
  assignee: string[]
  shape: {
    a: string
    b: string
  }
}

export const cases = writable<{ [id: string]: CaseT }>({
  '1': {
    assignee: ['me'],
    shape: {
      a: 'hi',
      b: 'bye',
    },
  },
})

export const currentUserId = writable<string>()

export const casesArr = derived([cases], ([$cases]) => Object.values($cases))

export const myCases = derived(
  [cases, currentUserId],
  ([tasksZ, currentUserIdZ]) =>
    Object.fromEntries(
      Object.entries(tasksZ).filter(([ignoredKey, value]) =>
        value.assignee.includes(currentUserIdZ)
      )
    )
)
