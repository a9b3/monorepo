import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: { note: import('../ipc/notes').ApiMethods }
  }
}
