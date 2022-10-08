import { writable } from 'svelte/store'

interface DashboardDoc {
  selectedView: 'grid' | 'line'
}

const dashboardStore = writable<DashboardDoc>({
  selectedView: 'grid',
})

export default dashboardStore
