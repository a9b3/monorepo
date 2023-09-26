export interface MenuItem {
  type?: 'item' | 'divider' | 'label'
  onClick?: () => void
  label?: string
}
