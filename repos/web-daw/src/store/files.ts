import { writable, derived } from 'svelte/store'

export type DawFileType = 'file' | 'directory'

export type DawFileMetaData = {
  url?: string
}

export type DawFile = {
  icon?: string
  id: string
  name: string
  type: DawFileType
  metadata?: DawFileMetaData
}
export type DawDirectory = {
  children: (DawFile | DawDirectory)[]
  icon?: string
  id: string
  name: string
  type: DawFileType
}

export const filesStore = writable<{
  categories: (DawFile | DawDirectory)[]
  selectedCategory: string | undefined
  collections: (DawFile | DawDirectory)[]
}>({
  selectedCategory: undefined,
  categories: [
    {
      icon: 'musicFill',
      id: crypto.randomUUID(),
      name: 'Sounds',
      type: 'directory',
      children: [
        {
          id: crypto.randomUUID(),
          name: 'Delays & Loops',
          type: 'directory',
          children: [
            {
              id: crypto.randomUUID(),
              name: '808s',
              type: 'directory',
              children: [
                {
                  id: crypto.randomUUID(),
                  name: 'Delays & Loops',
                  type: 'directory',
                  children: [
                    {
                      id: crypto.randomUUID(),
                      name: '808s',
                      type: 'directory',
                      children: [],
                    },
                    {
                      id: crypto.randomUUID(),
                      name: 'Cool Stuff',
                      type: 'file',
                    },
                  ],
                },
              ],
            },
            {
              id: crypto.randomUUID(),
              name: 'Cool Stuff',
              type: 'file',
            },
          ],
        },
        {
          id: crypto.randomUUID(),
          name: 'Drive & Color',
          type: 'directory',
          children: [
            {
              id: crypto.randomUUID(),
              name: 'Drive',
              type: 'directory',
              children: [],
            },
            {
              id: crypto.randomUUID(),
              name: 'Color',
              type: 'file',
            },
          ],
        },
        {
          id: crypto.randomUUID(),
          name: 'Foo',
          type: 'file',
        },
      ],
    },
    {
      icon: 'musicFill',
      id: crypto.randomUUID(),
      name: 'Drums',
      type: 'directory',
      children: [],
    },
    {
      icon: 'musicFill',
      id: crypto.randomUUID(),
      name: 'Instruments',
      type: 'directory',
      children: [],
    },
    {
      icon: 'musicFill',
      id: crypto.randomUUID(),
      name: 'Audio Effects',
      type: 'directory',
      children: [],
    },
    {
      icon: 'musicFill',
      id: crypto.randomUUID(),
      name: 'MIDI Effects',
      type: 'directory',
      children: [],
    },
    {
      icon: 'musicFill',
      id: crypto.randomUUID(),
      name: 'Plug Ins',
      type: 'directory',
      children: [],
    },
    {
      icon: 'musicFill',
      id: crypto.randomUUID(),
      name: 'Clips',
      type: 'directory',
      children: [],
    },
    {
      icon: 'musicFill',
      id: crypto.randomUUID(),
      name: 'Samples',
      type: 'directory',
      children: [],
    },
    {
      icon: 'musicFill',
      id: crypto.randomUUID(),
      name: 'Grooves',
      type: 'directory',
      children: [],
    },
    {
      icon: 'musicFill',
      id: crypto.randomUUID(),
      name: 'Templates',
      type: 'directory',
      children: [],
    },
  ],
  collections: [
    {
      icon: 'heartFill',
      id: crypto.randomUUID(),
      name: 'Favorites',
      type: 'directory',
      children: [],
    },
  ],
})

export const selectedDirectory = derived([filesStore], ([$filesStore]) => {
  const selected = [...$filesStore.categories, ...$filesStore.collections].find(
    f => f.id === $filesStore.selectedCategory
  )
  return (selected as DawDirectory)?.children || []
})

export default filesStore
