import { HISTORY_MAX_COUNT } from '@/config'
import { FAVORITE_UUID, HISTORY_UUID, LOCAL_UUID } from '@/config/menus'
import { defineStore, storeToRefs } from 'pinia'
import { useMenuStore } from './menu'

export interface Playlist {
  id: number
  title: string
  description?: string
  cover?: string
  count: number
}

export const useUserListStore = defineStore('userList', () => {
  const menuStore = useMenuStore()
  const { activeMenu } = storeToRefs(menuStore)

  const musicList = ref<AudioMetadata[]>([])

  async function getMusicList(id: number) {
    // console.log('======= id ( userList.ts ) =======\n', id)
    const dbOperations: Record<number, string> = {
      [LOCAL_UUID]: 'db:get-all-songs',
      [HISTORY_UUID]: 'db:get-history-songs',
      [FAVORITE_UUID]: 'db:get-favorite-songs',
    }
    if (id in dbOperations) {
      // console.log('======= dbOperations[id] ( userList.ts ) =======\n', dbOperations[id])
      musicList.value = await window.ipcRenderer.invoke(dbOperations[id])
    }
    else {
      musicList.value = await window.ipcRenderer.invoke('db:get-playlist-songs', id)
    }
    // console.log('======= musicList.value ( userList.ts ) =======\n', musicList.value)
  }

  watchEffect(async () => {
    // console.log('======= activeMenu.value ( userList.ts ) =======\n', activeMenu.value)
    await getMusicList(activeMenu.value)
  })

  // 删除功能肯定是在当前音乐列表才能执行 所以使用 activeMenu 来判断
  async function deleteMusic(music: AudioMetadata) {
    const songId = music.id
    if (activeMenu.value === LOCAL_UUID) {
      await window.ipcRenderer.invoke('db:delete-song', songId)
      // TODO: 还要删除该音乐对应的封面图片
    }
    else if (activeMenu.value === HISTORY_UUID) {
      await window.ipcRenderer.invoke('db:delete-history', songId)
    }
    else if (activeMenu.value === FAVORITE_UUID) {
      await window.ipcRenderer.invoke('db:update-favorite', songId, false)
      // alert('已取消喜欢')
    }
    else {
      await window.ipcRenderer.invoke('db:delete-from-playlist', Number(activeMenu.value), songId)
    }

    // 刷新列表
    // await getMusicList(activeMenu.value.toString())
    musicList.value = musicList.value.filter(item => item.id !== songId)
    if (activeMenu.value === LOCAL_UUID) {
      // 影响所有列表, 所以重新获取
      await menuStore.getUserMenus()
      // TODO: defaultMenus 也要更新 count
    }
    else {
      menuStore.updateMenuCount(activeMenu.value, musicList.value.length)
    }
  }

  function refreshHistoryList(music: AudioMetadata) {
    if (activeMenu.value !== HISTORY_UUID)
      return

    const index = musicList.value.findIndex(item => item.id === music.id)
    if (index !== -1) {
      musicList.value.splice(index, 1)
    }

    musicList.value.unshift(music)

    if (musicList.value.length > HISTORY_MAX_COUNT)
      musicList.value.pop()
  }

  // 更新最近播放列表
  async function addToHistoryList(music: AudioMetadata) {
    const count = await window.ipcRenderer.invoke('db:add-history', music.id)
    // console.log('添加播放历史成功', count)

    refreshHistoryList(music)

    menuStore.updateMenuCount(HISTORY_UUID, count)
  }

  return {
    musicList,
    getMusicList,
    deleteMusic,
    addToHistoryList,
  }
})
