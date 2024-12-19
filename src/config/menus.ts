// 系统歌单 ID
export const FAVORITE_UUID = '64001d93-5ef0-45a2-a548-222222222222'
export const RECENT_UUID = '64001d93-5ef0-45a2-a548-111111111111'
export const LOCAL_UUID = '64001d93-5ef0-45a2-a548-000000000000'

export const SYSTEM_MENUS: CustomPlaylist[] = [
  {
    id: FAVORITE_UUID,
    icon: 'i-carbon-favorite',
    title: '喜欢',
    description: '喜欢的音乐',
    count: 0,
  },
  {
    id: RECENT_UUID,
    icon: 'i-carbon-recently-viewed',
    title: '最近播放',
    description: '最近播放的音乐',
    count: 0,
  },
  {
    id: LOCAL_UUID,
    icon: 'i-carbon-download',
    title: '本地和下载',
    description: '本地和下载的音乐',
    count: 0,
  },
]
