import { writable } from 'svelte/store'

interface DashboardDoc {
  selectedView: string | undefined
}

const dashboardStore = writable<DashboardDoc>({
  selectedView: undefined,
})

export default dashboardStore
