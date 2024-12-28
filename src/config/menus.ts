import type { Playlist } from '@/stores/userList'

// 系统歌单 ID
export const FAVORITE_UUID = 99999
export const HISTORY_UUID = 99998
export const LOCAL_UUID = 99997

export const SYSTEM_MENUS: Playlist[] = [
  {
    id: FAVORITE_UUID,
    cover: 'i-carbon-favorite',
    title: '喜欢',
    description: '喜欢的音乐',
    count: 0,
  },
  {
    id: HISTORY_UUID,
    cover: 'i-carbon-recently-viewed',
    title: '最近播放',
    description: '最近播放的音乐',
    count: 0,
  },
  {
    id: LOCAL_UUID,
    cover: 'i-carbon-download',
    title: '本地和下载',
    description: '本地和下载的音乐',
    count: 0,
  },
]
