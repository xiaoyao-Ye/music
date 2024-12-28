import { ipcMain } from 'electron'
import { In } from 'typeorm'
import { AppDataSource } from './data-source'
import { PlayHistory } from './entities/PlayHistory.entity'
import { Playlist } from './entities/Playlist.entity'
import { PlaylistSong } from './entities/PlaylistSong.entity'
import { Song } from './entities/Song.entity'

/**
 * 获取所有歌曲
 * @returns 所有歌曲列表
 */
export async function getAllSongs() {
  // const win = BrowserWindow.getFocusedWindow()
  try {
    // win?.webContents.send('main-process-message', 'getAllSongs')
    const songs = await AppDataSource.manager.find(Song, {
      order: {
        createdAt: 'DESC',
      },
    })
    // win?.webContents.send('main-process-message', songs)
    return songs
  }
  catch (error) {
    // win?.webContents.send('main-process-message', error)
    // ipcMain.emit('db:get-all-songs-error', error)
    console.error('获取所有歌曲失败:', error)
    return []
  }
}

/**
 * 获取收藏的歌曲
 * @returns 收藏的歌曲列表
 */
export async function getFavoriteSongs() {
  try {
    // 查询所有收藏的歌曲
    const songs = await AppDataSource.manager.find(Song, {
      where: {
        isFavorite: true,
      },
      order: {
        updatedAt: 'DESC', // 按最后更新时间排序
      },
    })
    return songs
  }
  catch (error) {
    console.error('获取收藏歌曲失败:', error)
    return []
  }
}

/**
 * 获取最近播放的歌曲
 * @param limit 限制返回数量，默认 100 首
 * @returns 最近播放的歌曲列表
 */
export async function getHistorySongs(limit: number = 300) {
  try {
    // 获取最近的播放记录
    const histories = await AppDataSource.manager.find(PlayHistory, {
      order: {
        playedAt: 'DESC',
      },
      take: limit,
    })
    // console.log('======= histories ( operations.ts ) =======\n', histories)

    // 获取所有歌曲的 ID
    const songIds = histories.map(history => history.songId)

    // 如果没有播放记录，直接返回
    if (songIds.length === 0)
      return []

    // 查询所有歌曲详情
    const songs = await AppDataSource.manager.find(Song, {
      where: {
        id: In(songIds),
      },
    })
    // console.log('======= songs ( operations.ts ) =======\n', songs)

    // 按照播放历史的顺序返回歌曲
    return songIds.map(id => songs.find(song => song.id === id))
  }
  catch (error) {
    console.error('获取最近播放歌曲失败:', error)
    return []
  }
}

/**
 * 获取指定播放列表的歌曲
 * @param playlistId 播放列表ID
 * @returns 播放列表中的歌曲
 */
export async function getPlaylistSongs(playlistId: string) {
  // console.log('======= playlistId ( operations.ts ) =======\n', playlistId)
  try {
    // 通过关系表查询播放列表中的歌曲
    const playlistSongs = await AppDataSource.manager.find(PlaylistSong, {
      where: {
        playlistId: Number(playlistId),
      },
      order: {
        sort: 'ASC',
      },
    })

    // 获取所有歌曲的 ID
    const songIds = playlistSongs.map(item => item.songId)

    // 如果播放列表为空，直接返回
    if (songIds.length === 0)
      return []

    // 查询所有歌曲详情
    const songs = await AppDataSource.manager.find(Song, {
      where: {
        id: In(songIds),
      },
    })

    // 按照播放列表的排序返回歌曲
    return songIds.map(id => songs.find(song => song.id === id))
  }
  catch (error) {
    console.error('获取播放列表歌曲失败:', error)
    return []
  }
}

/**
 * 添加播放列表
 * @param playlist 播放列表数据
 * @returns 添加后的播放列表
 */
export async function addPlaylist(playlist: Partial<Playlist>) {
  try {
    const newPlaylist = AppDataSource.manager.create(Playlist, playlist)
    await AppDataSource.manager.save(Playlist, newPlaylist)
    return newPlaylist.id
  }
  catch (error) {
    console.error('添加播放列表失败:', error)
    return null
  }
}

/**
 * 获取所有播放列表
 * @returns 所有播放列表
 */
export async function getPlaylist() {
  try {
    const playlists = await AppDataSource.manager.find(Playlist, {
      order: {
        createdAt: 'DESC', // 按创建时间降序排序
      },
    })
    return playlists
  }
  catch (error) {
    console.error('获取所有播放列表失败:', error)
    return []
  }
}

/**
 * 获取播放列表信息
 * @param playlistId 播放列表ID
 * @returns 播放列表信息
 */
export async function getPlaylistInfo(playlistId: string) {
  const playlist = await AppDataSource.manager.findOne(Playlist, { where: { id: Number(playlistId) } })
  return playlist
}

/**
 * 添加或更新歌曲到数据库
 * @param songData 歌曲数据
 * @returns 添加或更新后的歌曲
 */
export async function addSong(songData: Partial<Song>) {
  try {
    // 先查找是否存在相同路径的歌曲
    const existingSong = await AppDataSource.manager.findOne(Song, {
      where: {
        path: songData.path,
      },
    })

    if (existingSong) {
      // 如果存在，更新歌曲信息
      // const oldCover = existingSong.cover
      Object.assign(existingSong, songData)

      // 如果有新的封面图片数据，保存到文件
      // if (songData.cover?.startsWith('data:image')) {
      //   const coverPath = await saveImageToFile(songData.cover, existingSong.id)
      //   if (coverPath)
      //     existingSong.cover = coverPath
      //   else
      //     existingSong.cover = oldCover // 如果保存失败，保留原来的封面
      // }

      await AppDataSource.manager.save(Song, existingSong)
      return existingSong
    }
    else {
      // 如果不存在，创建新歌曲
      const song = AppDataSource.manager.create(Song, {
        ...songData,
        playCount: 0,
        isFavorite: false,
      })

      // 先保存歌曲以获取 ID
      await AppDataSource.manager.save(Song, song)

      // 如果有封面图片数据，保存到文件
      // if (song.cover?.startsWith('data:image')) {
      //   const coverPath = await saveImageToFile(song.cover, song.id)
      //   if (coverPath) {
      //     song.cover = coverPath
      //     await AppDataSource.manager.save(Song, song)
      //   }
      // }

      return song
    }
  }
  catch (error) {
    console.error('添加或更新歌曲失败:', error)
    return null
  }
}

/**
 * 添加歌曲到播放列表
 * @param playlistId 播放列表ID
 * @param songId 歌曲ID
 * @returns 是否添加成功
 */
export async function addSongToPlaylist(playlistId: number, songId: number) {
  try {
    // 检查歌曲是否已在播放列表中
    const existingItem = await AppDataSource.manager.findOne(PlaylistSong, {
      where: {
        playlistId,
        songId,
      },
    })

    if (existingItem)
      return 0

    // 获取当前播放列表中最大的排序值
    const maxSortResult = await AppDataSource.manager
      .createQueryBuilder(PlaylistSong, 'playlistSong')
      .select('MAX(playlistSong.sort)', 'maxSort')
      .where('playlistSong.playlistId = :playlistId', { playlistId })
      .getRawOne()

    const sort = (maxSortResult?.maxSort ?? -1) + 1

    // 创建新的关联记录
    const playlistSong = AppDataSource.manager.create(PlaylistSong, {
      playlistId,
      songId,
      sort,
    })
    await AppDataSource.manager.save(PlaylistSong, playlistSong)

    // 更新播放列表的歌曲数量
    const playlist = await AppDataSource.manager.findOne(Playlist, {
      where: { id: playlistId },
    })

    if (playlist) {
      const count = await AppDataSource.manager.count(PlaylistSong, {
        where: { playlistId },
      })
      playlist.count = count
      await AppDataSource.manager.save(Playlist, playlist)
      return count
    }

    return 0
  }
  catch (error) {
    console.error('添加歌曲到播放列表失败:', error)
    return 0
  }
}

/**
 * 添加播放历史
 * @param songId 歌曲ID
 * @returns 是否添加成功
 */
export async function addHistory(songId: number) {
  const history = AppDataSource.manager.create(PlayHistory, { songId, playedAt: new Date() })
  await AppDataSource.manager.save(PlayHistory, history)
  // 返回当前播放历史列表总数
  const count = await AppDataSource.manager.count(PlayHistory)
  // 如果播放历史列表总数大于 300，则删除更新时间最早的播放历史
  if (count > 300) {
    const oldestHistory = await AppDataSource.manager.findOne(PlayHistory, {
      order: {
        playedAt: 'ASC',
      },
    })
    if (oldestHistory)
      await AppDataSource.manager.delete(PlayHistory, oldestHistory.songId)
  }
  return count
}

/**
 * 从数据库中删除歌曲
 * @param songId 歌曲ID
 * @returns 是否删除成功
 */
export async function deleteSong(songId: number) {
  try {
    // 先删除关联表中的数据
    await AppDataSource.manager.delete(PlaylistSong, { songId })
    await AppDataSource.manager.delete(PlayHistory, { songId })
    // 删除歌曲
    await AppDataSource.manager.delete(Song, { id: songId })
    return true
  }
  catch (error) {
    console.error('删除歌曲失败:', error)
    return false
  }
}

/**
 * 从播放历史中删除歌曲
 * @param songId 歌曲ID
 * @returns 是否删除成功
 */
export async function deleteHistory(songId: number) {
  try {
    await AppDataSource.manager.delete(PlayHistory, { songId })
    return true
  }
  catch (error) {
    console.error('从播放历史中删除歌曲失败:', error)
    return false
  }
}

/**
 * 更新歌曲的收藏状态
 * @param songId 歌曲ID
 * @param isFavorite 是否收藏
 * @returns 是否更新成功
 */
export async function updateFavorite(songId: number, isFavorite: boolean) {
  try {
    await AppDataSource.manager.update(Song, { id: songId }, { isFavorite })
    return true
  }
  catch (error) {
    console.error('更新歌曲收藏状态失败:', error)
    return false
  }
}

/**
 * 从播放列表中删除歌曲
 * @param playlistId 播放列表ID
 * @param songId 歌曲ID
 * @returns 是否删除成功
 */
export async function deleteFromPlaylist(playlistId: number, songId: number) {
  try {
    // 删除关联记录
    await AppDataSource.manager.delete(PlaylistSong, { playlistId, songId })

    // 更新播放列表的歌曲数量
    const count = await AppDataSource.manager.count(PlaylistSong, { where: { playlistId } })
    await AppDataSource.manager.update(Playlist, { id: playlistId }, { count })

    return true
  }
  catch (error) {
    console.error('从播放列表中删除歌曲失败:', error)
    return false
  }
}

// const dbOperations = {
//   getAllSongs,
//   getFavoriteSongs,
//   getHistorySongs,
//   getPlaylistSongs,
//   addPlaylist,
//   getPlaylist,
//   getPlaylistInfo,
//   addSong,
//   addSongToPlaylist,
//   addHistory,
// }

// ipcMain.handle('db', (_, operation: keyof typeof dbOperations, ...args: unknown[]) => {
//   return dbOperations[operation](...args)
// })

ipcMain.handle('db:add-song', (_, songData: Partial<Song>) => addSong(songData))
ipcMain.handle('db:get-all-songs', getAllSongs)
ipcMain.handle('db:get-playlist-songs', (_, playlistId: string) => getPlaylistSongs(playlistId))
ipcMain.handle('db:get-history-songs', _ => getHistorySongs())
ipcMain.handle('db:get-favorite-songs', _ => getFavoriteSongs())
ipcMain.handle('db:add-playlist', (_, playlist: Partial<Playlist>) => addPlaylist(playlist))
ipcMain.handle('db:get-playlist', _ => getPlaylist())
ipcMain.handle('db:get-playlist-info', (_, playlistId: string) => getPlaylistInfo(playlistId))
ipcMain.handle('db:add-history', (_, songId: number) => addHistory(songId))
ipcMain.handle('db:add-song-to-playlist', (_, playlistId: number, songId: number) => addSongToPlaylist(playlistId, songId))
ipcMain.handle('db:delete-song', (_, songId: number) => deleteSong(songId))
ipcMain.handle('db:delete-history', (_, songId: number) => deleteHistory(songId))
ipcMain.handle('db:update-favorite', (_, songId: number, isFavorite: boolean) => updateFavorite(songId, isFavorite))
ipcMain.handle('db:delete-from-playlist', (_, playlistId: number, songId: number) => deleteFromPlaylist(playlistId, songId))
