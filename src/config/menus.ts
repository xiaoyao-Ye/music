import { randomUUID } from '@/lib'
import { LOCAL_UUID } from './index'

export const SYSTEM_MENUS: CustomPlaylist[] = [
  {
    id: randomUUID(),
    icon: 'i-carbon-favorite',
    title: '喜欢',
    description: '喜欢的音乐',
    count: 0,
  },
  {
    id: randomUUID(),
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
