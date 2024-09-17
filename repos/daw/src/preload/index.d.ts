import { ElectronAPI } from '@electron-toolkit/preload'
import { ApiMethods } from '../ipc/notes'

declare global {
  interface Window {
    electron: ElectronAPI
    api: { note: ApiMethods }
  }
}
