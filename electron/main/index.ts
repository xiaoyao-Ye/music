/* eslint-disable node/prefer-global/process */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { app, BrowserWindow, dialog, ipcMain, protocol, shell } from 'electron'
import { parseFile } from 'music-metadata'

// 添加这些新函数
async function processAudioFile(filePath: string) {
  try {
    const metadata = await parseFile(filePath)
    // const picture = metadata.common.picture?.[0]

    // 将 Uint8Array 转换为 Buffer

    // const buffer = Buffer.from(picture.data)

    // 将 Buffer 转换为 Base64 字符串
    // const base64String = buffer.toString('base64')

    return {
      path: filePath,
      title: metadata.common.title || path.basename(filePath),
      artist: metadata.common.artist || '未知艺术家',
      album: metadata.common.album || '未知专辑',
      duration: metadata.format.duration,
      // cover: `data:${picture.format};base64,${base64String}`,
    }
  }
  catch (error) {
    console.error(`处理文件 ${filePath} 时出错:`, error)
    return null
  }
}

async function processDirectory(dirPath: string) {
  const readdir = promisify(fs.readdir)
  const stat = promisify(fs.stat)

  try {
    const files = await readdir(dirPath)
    const audioFiles = []

    for (const file of files) {
      const filePath = path.join(dirPath, file)
      const stats = await stat(filePath)

      // eslint-disable-next-line regexp/no-unused-capturing-group
      if (stats.isFile() && /\.(mp3|wav|ogg|flac|m4a)$/i.test(file)) {
        const metadata = await processAudioFile(filePath)
        if (metadata)
          audioFiles.push(metadata)
      }
    }

    return audioFiles
  }
  catch (error) {
    console.error('处理目录时出错:', error)
    return []
  }
}

// 在 ipcMain 处理程序部分添加
ipcMain.handle('select-files', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: '音频文件', extensions: ['mp3', 'wav', 'ogg', 'flac', 'm4a'] },
    ],
  })

  if (!result.canceled) {
    const metadataPromises = result.filePaths.map(processAudioFile)
    const metadata = await Promise.all(metadataPromises)
    return metadata.filter(item => item !== null)
  }
  return []
})

ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  })

  if (!result.canceled) {
    return await processDirectory(result.filePaths[0])
  }
  return []
})

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
    title: 'Main window',
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
    width: 1380,
    height: 838,
    minWidth: 996,
    minHeight: 600,
    webPreferences: {
      preload,
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

app.whenReady().then(() => {
  // 注册自定义协议
  protocol.registerFileProtocol('music', (request, callback) => {
    const filePath = decodeURI(request.url.replace('music://', ''))
    try {
      return callback(filePath)
    }
    catch (error) {
      console.error(error)
      return callback({ error: -2 })
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
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
  }
  else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})
