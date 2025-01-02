import type { MigrationInterface, QueryRunner } from 'typeorm'
import { BrowserWindow } from 'electron'

export class Init implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const win = BrowserWindow.getFocusedWindow()
    win?.webContents.send('main-process-message', '数据库初始化开始')
    const playHistory = await queryRunner.hasTable('play_history')
    win?.webContents.send('main-process-message', '数据库初始化检查 play_history', playHistory)
    if (!playHistory) {
      win?.webContents.send('main-process-message', '数据库初始化创建 PlayHistory')
      await queryRunner.query(`
        CREATE TABLE "play_history" (
          "songId" integer PRIMARY KEY NOT NULL,
          "playedAt" datetime NOT NULL
        )
      `)
    }

    const playlist = await queryRunner.hasTable('playlist')
    win?.webContents.send('main-process-message', '数据库初始化检查 playlist', playlist)
    if (!playlist) {
      win?.webContents.send('main-process-message', '数据库初始化创建 Playlist')
      await queryRunner.query(`
        CREATE TABLE "playlist" (
          "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          "title" varchar NOT NULL, "description" varchar,
          "cover" varchar,
          "count" integer NOT NULL DEFAULT (0),
          "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
          "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
        )
      `)
    }

    const playlistSong = await queryRunner.hasTable('playlist_song')
    win?.webContents.send('main-process-message', '数据库初始化检查 playlist_song', playlistSong)
    if (!playlistSong) {
      win?.webContents.send('main-process-message', '数据库初始化创建 PlaylistSong')
      await queryRunner.query(`
        CREATE TABLE "playlist_song" (
          "playlistId" integer NOT NULL,
          "songId" integer NOT NULL,
          "createdAt" datetime NOT NULL DEFAULT (datetime('now'))
        )
      `)
      // "sort" integer NOT NULL DEFAULT (0), PRIMARY KEY ("playlistId", "songId")
    }

    const song = await queryRunner.hasTable('song')
    win?.webContents.send('main-process-message', '数据库初始化检查 song', song)
    if (!song) {
      win?.webContents.send('main-process-message', '数据库初始化创建 song')
      await queryRunner.query(`
        CREATE TABLE "song" (
          "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          "title" varchar NOT NULL,
          "artist" varchar NOT NULL,
          "album" varchar NOT NULL,
          "duration" float NOT NULL,
          "path" varchar NOT NULL,
          "cover" varchar,
          "isFavorite" boolean NOT NULL DEFAULT (0),
          "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
          "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
        )
      `)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const playHistory = await queryRunner.hasTable('play_history')
    if (playHistory) {
      await queryRunner.query(`DROP TABLE "play_history"`)
    }

    const playlist = await queryRunner.hasTable('playlist')
    if (playlist) {
      await queryRunner.query(`DROP TABLE "playlist"`)
    }

    const playlistSong = await queryRunner.hasTable('playlist_song')
    if (playlistSong) {
      await queryRunner.query(`DROP TABLE "playlist_song"`)
    }

    const song = await queryRunner.hasTable('song')
    if (song) {
      await queryRunner.query(`DROP TABLE "song"`)
    }
  }
}
