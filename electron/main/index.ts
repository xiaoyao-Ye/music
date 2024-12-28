/* eslint-disable node/prefer-global/process */
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { app, BrowserWindow, protocol, shell } from 'electron'
import { initializeDatabase } from './database/data-source'
import './file'
import './store'
import './database/operations'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.APP_ROOT = path.join(__dirname, '../..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1'))
  app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32')
  app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null
const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'Music',
    icon: path.join(process.env.VITE_PUBLIC, 'voice.iconset/icon_512x512.png'),
    width: 1266,
    height: 838,
    // minWidth: 996,
    minWidth: 1046,
    minHeight: 670,
    webPreferences: {
      preload,
      // webSecurity: false,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    },
  })

  if (VITE_DEV_SERVER_URL) { // #298
    win.loadURL(VITE_DEV_SERVER_URL)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  }
  else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:'))
      shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344
}

app.whenReady().then(async () => {
  // const win = BrowserWindow.getFocusedWindow()
  // win?.webContents.send('main-process-message', '创建窗口完成')

  // 初始化数据库
  await initializeDatabase()

  // win?.webContents.send('main-process-message', '初始化数据库完成')
  // 注册自定义协议
  // protocol.handle('music', (request) => {
  //   console.log('======= request ( index.ts ) =======\n', request)
  //   const filePath = decodeURI(request.url.replace('music://', ''))
  //   const url = pathToFileURL(filePath.toString())
  //   console.log('======= url ( index.ts ) =======\n', url)
  //   // return net.fetch(pathToFileURL(filePath).toString())
  //   return net.fetch(url.toString())
  // })

  protocol.registerFileProtocol('music', (request, callback) => {
    const url = request.url.replace(/^music:\/\//, '')
    // Decode URL to prevent errors when loading filenames with UTF-8 chars or chars like "#"
    const decodedUrl = decodeURI(url) // Needed in case URL contains spaces
    try {
      return callback(decodedUrl)
    }
    catch (error) {
      console.error('ERROR: registerLocalResourceProtocol: Could not get file path:', error)
    }
  })

  createWindow()
})

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin')
    app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized())
      win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  }
  else {
    createWindow()
  }
})

// New window example arg: new windows url
// ipcMain.handle('open-win', (_, arg) => {
//   const childWindow = new BrowserWindow({
//     webPreferences: {
//       preload,
//       nodeIntegration: true,
//       contextIsolation: false,
//     },
//   })

//   if (VITE_DEV_SERVER_URL) {
//     childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
//   }
//   else {
//     childWindow.loadFile(indexHtml, { hash: arg })
//   }
// })
