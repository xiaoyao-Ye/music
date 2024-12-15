declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}

interface Window {
  // expose in the `electron/preload/index.ts`
  ipcRenderer: import('electron').IpcRenderer
}

interface AudioMetadata {
  path: string
  title: string
  artist?: string
  album?: string
  duration?: number
  cover?: string
}

interface CustomPlaylist {
  id: string
  title: string
  description: string
  coverImage?: string
  icon?: string
  count: number
}
