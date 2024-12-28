import path from 'node:path'
import { app, BrowserWindow } from 'electron'
import { DataSource } from 'typeorm'
import { PlayHistory } from './entities/PlayHistory.entity'
import { Playlist } from './entities/Playlist.entity'
import { PlaylistSong } from './entities/PlaylistSong.entity'
import { Song } from './entities/Song.entity'
import 'reflect-metadata'

// const isDev = process.env.NODE_ENV === 'development'
// const isDev = !!process.env.VITE_DEV_SERVER_URL
// TODO: 数据库迁移没配置, 直接使用同步
const isDev = true

// 获取应用数据目录
const userDataPath = app.getPath('userData')
const dbPath = path.join(userDataPath, 'database.sqlite')

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: dbPath,
  synchronize: isDev, // 开发环境下自动同步数据库结构
  logging: isDev,
  entities: [Song, Playlist, PlayHistory, PlaylistSong],
  // migrations: ['./migrations/*.ts'],
  // migrationsTableName: 'migration_table',
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
    // console.log('数据库连接已初始化')
  }
  catch (error) {
    win?.webContents.send('main-process-message', error)
    console.error('数据库初始化错误:', error)
  }
}
