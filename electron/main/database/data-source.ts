import path from 'node:path'
import { app, BrowserWindow } from 'electron'
import { DataSource } from 'typeorm'
import { PlayHistory } from './entities/PlayHistory.entity'
import { Playlist } from './entities/Playlist.entity'
import { PlaylistSong } from './entities/PlaylistSong.entity'
import { Song } from './entities/Song.entity'
import { Init } from './migrations/init'
import 'reflect-metadata'

const isDev = !!process.env.VITE_DEV_SERVER_URL

// 获取应用数据目录
const userDataPath = app.getPath('userData')
const dbPath = path.join(userDataPath, `${isDev ? 'dev.' : ''}database.sqlite`)

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: dbPath,
  // synchronize: isDev, // 开发环境下自动同步数据库结构
  // logging: isDev,
  synchronize: false, // 开发环境下自动同步数据库结构
  logging: true,
  entities: [Song, Playlist, PlayHistory, PlaylistSong],
  // migrationsRun: true,
  // migrations: ['./migrations/init.ts'],
  statementCacheSize: 100,
  // prepareDatabase: (db) => {
  // console.log('======= db ( data-source.ts ) =======\n', db)
  // db.pragma('journal_mode = WAL')
  // },
})

// 初始化数据库连接
export async function initializeDatabase() {
  const win = BrowserWindow.getFocusedWindow()
  win?.webContents.send('main-process-message', '数据库连接开始')
  try {
    await AppDataSource.initialize()
    win?.webContents.send('main-process-message', '数据库连接已初始化')
    await new Init().up(AppDataSource.createQueryRunner())
    win?.webContents.send('main-process-message', '数据库表初始化完成')
    // console.log('数据库连接已初始化')
  }
  catch (error) {
    win?.webContents.send('main-process-message', error)
    console.error('数据库初始化错误:', error)
  }
}
