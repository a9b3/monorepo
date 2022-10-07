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
      children: [
        {
          id: crypto.randomUUID(),
          name: '808s',
          type: 'directory',
          children: [
            {
              id: crypto.randomUUID(),
              name: 'FireYear.wav',
              type: 'file',
              metadata: {
                url: '/content/drums/808s/808 (FireYea).wav',
              },
            },
            {
              id: crypto.randomUUID(),
              name: 'LockDown.wav',
              type: 'file',
              metadata: {
                url: '/content/drums/808s/808 (LockDown).wav',
              },
            },
          ],
        },
        {
          id: crypto.randomUUID(),
          name: 'claps',
          type: 'directory',
          children: [
            {
              id: crypto.randomUUID(),
              name: 'Clap 1.wav',
              type: 'file',
              metadata: {
                url: '/content/drums/claps/Clap 1.wav',
              },
            },
            {
              id: crypto.randomUUID(),
              name: 'Clap 2.wav',
              type: 'file',
              metadata: {
                url: '/content/drums/claps/Clap 2.wav',
              },
            },
            {
              id: crypto.randomUUID(),
              name: 'Clap 3.wav',
              type: 'file',
              metadata: {
                url: '/content/drums/claps/Clap 3.wav',
              },
            },
            {
              id: crypto.randomUUID(),
              name: 'Clap 4.wav',
              type: 'file',
              metadata: {
                url: '/content/drums/claps/Clap 4.wav',
              },
            },
          ],
        },
        {
          id: crypto.randomUUID(),
          name: 'hihats',
          type: 'directory',
          children: [
            {
              id: crypto.randomUUID(),
              name: 'Hihat 1.wav',
              type: 'file',
              metadata: {
                url: '/content/drums/hats/Hihat 1.wav',
              },
            },
            {
              id: crypto.randomUUID(),
              name: 'Hihat 2.wav',
              type: 'file',
              metadata: {
                url: '/content/drums/hats/Hihat 2.wav',
              },
            },
            {
              id: crypto.randomUUID(),
              name: 'Hihat 3.wav',
              type: 'file',
              metadata: {
                url: '/content/drums/hats/Hihat 3.wav',
              },
            },
            {
              id: crypto.randomUUID(),
              name: 'Hihat 4.wav',
              type: 'file',
              metadata: {
                url: '/content/drums/hats/Hihat 4.wav',
              },
            },
          ],
        },
        {
          id: crypto.randomUUID(),
          name: 'kicks',
          type: 'directory',
          children: [
            {
              id: crypto.randomUUID(),
              name: 'Kick Bold.wav',
              type: 'file',
              metadata: {
                url: '/content/drums/kicks/Kick - Bold.wav',
              },
            },
            {
              id: crypto.randomUUID(),
              name: 'Kick Clutch.wav',
              type: 'file',
              metadata: {
                url: '/content/drums/kicks/Kick - Clutch.wav',
              },
            },
            {
              id: crypto.randomUUID(),
              name: 'Kick Inner.wav',
              type: 'file',
              metadata: {
                url: '/content/drums/kicks/Kick - Inner.wav',
              },
            },
          ],
        },
        {
          id: crypto.randomUUID(),
          name: 'openhats',
          type: 'directory',
          children: [
            {
              id: crypto.randomUUID(),
              name: 'Cymbal.wav',
              type: 'file',
              metadata: {
                url: '/content/drums/openhats/Cymbal.wav',
              },
            },
            {
              id: crypto.randomUUID(),
              name: 'OpenShort 1.wav',
              type: 'file',
              metadata: {
                url: '/content/drums/openhats/OpenShort 1.wav',
              },
            },
            {
              id: crypto.randomUUID(),
              name: 'OpenShort 2.wav',
              type: 'file',
              metadata: {
                url: '/content/drums/openhats/OpenShort 2.wav',
              },
            },
            {
              id: crypto.randomUUID(),
              name: 'OpenShort 3.wav',
              type: 'file',
              metadata: {
                url: '/content/drums/openhats/OpenShort 3.wav',
              },
            },
          ],
        },
        {
          id: crypto.randomUUID(),
          name: 'percs',
          type: 'directory',
          children: [
            {
              id: crypto.randomUUID(),
              name: 'Perc 1.wav',
              type: 'file',
              metadata: {
                url: '/content/drums/percs/Perc 1.wav',
              },
            },
            {
              id: crypto.randomUUID(),
              name: 'Perc 2.wav',
              type: 'file',
              metadata: {
                url: '/content/drums/percs/Perc 2.wav',
              },
            },
            {
              id: crypto.randomUUID(),
              name: 'Perc 3.wav',
              type: 'file',
              metadata: {
                url: '/content/drums/percs/Perc 3.wav',
              },
            },
            {
              id: crypto.randomUUID(),
              name: 'Perc 4.wav',
              type: 'file',
              metadata: {
                url: '/content/drums/percs/Perc 4.wav',
              },
            },
            {
              id: crypto.randomUUID(),
              name: 'Perc 5.wav',
              type: 'file',
              metadata: {
                url: '/content/drums/percs/Perc 5.wav',
              },
            },
            {
              id: crypto.randomUUID(),
              name: 'Perc 6.wav',
              type: 'file',
              metadata: {
                url: '/content/drums/percs/Perc 6.wav',
              },
            },
          ],
        },
        {
          id: crypto.randomUUID(),
          name: 'snares',
          type: 'directory',
          children: [
            {
              id: crypto.randomUUID(),
              name: 'Snare (50kWatch).wav',
              type: 'file',
              metadata: {
                url: '/content/drums/snares/Snare (50kWatch).wav',
              },
            },
            {
              id: crypto.randomUUID(),
              name: 'Snare (Bounce3).wav',
              type: 'file',
              metadata: {
                url: '/content/drums/snares/Snare (Bounce3).wav',
              },
            },
            {
              id: crypto.randomUUID(),
              name: 'Snare (Doctor).wav',
              type: 'file',
              metadata: {
                url: '/content/drums/snares/Snare (Doctor).wav',
              },
            },
            {
              id: crypto.randomUUID(),
              name: 'Snare (Factory).wav',
              type: 'file',
              metadata: {
                url: '/content/drums/snares/Snare (Factory).wav',
              },
            },
            {
              id: crypto.randomUUID(),
              name: 'Snare (Future).wav',
              type: 'file',
              metadata: {
                url: '/content/drums/snares/Snare (Future).wav',
              },
            },
            {
              id: crypto.randomUUID(),
              name: 'Snare (GodIsGood).wav',
              type: 'file',
              metadata: {
                url: '/content/drums/snares/Snare (GodIsGood).wav',
              },
            },
          ],
        },
      ],
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
