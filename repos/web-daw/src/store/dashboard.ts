import { writable } from 'svelte/store'

interface DashboardDoc {
  selectedView: 'grid' | 'line'
  sortBy: 'lastModified' | 'alphabetical'
}

const dashboardStore = writable<DashboardDoc>({
  selectedView: 'grid',
  sortBy: 'lastModified',
})

export default dashboardStore
