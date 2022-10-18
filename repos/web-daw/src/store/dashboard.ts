import { writable } from 'svelte/store'

interface DashboardDoc {
  selectedView: 'grid' | 'line'
  sortBy: 'lastModified' | 'alphabetical'
}

export const dashboardStore = writable<DashboardDoc>({
  selectedView: 'grid',
  sortBy: 'lastModified',
})

export const resetDashboardStore = () => {
  dashboardStore.set({
    selectedView: 'grid',
    sortBy: 'lastModified',
  })
}

export default dashboardStore
