import type { Playlist } from './userList'
import { MENU_INFO } from '@/config'
import { FAVORITE_UUID, HISTORY_UUID, LOCAL_UUID, SYSTEM_MENUS } from '@/config/menus'
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', () => {
  const defaultMenus = useStorage<Playlist[]>(MENU_INFO, SYSTEM_MENUS)
  const userMenus = ref<Playlist[]>([])
  const activeMenu = ref<number>(LOCAL_UUID)

  // 使用 markRaw 避免菜单对象的响应性,这样更新菜单内部属性时不会触发计算属性
  // const rawMenus = markRaw(defaultMenus.value)
  const activeMenuInfo = computed(() => [...defaultMenus.value, ...userMenus.value].find(item => item.id === activeMenu.value)!)

  async function getUserMenus() {
    const list = await window.ipcRenderer.invoke('db:get-playlist')
    console.log('======= list ( userList.ts ) =======\n', list)
    userMenus.value = list
  }

  onMounted(async () => {
    await getUserMenus()
  })

  function getDefaultMenu(menuId: number) {
    return defaultMenus.value.find(item => item.id === menuId)!
  }

  /**
   * 更新菜单计数
   * @param menuId 菜单id
   * @param count 数量(不传数量默认原有数量+1)
   */
  function updateMenuCount(menuId: number, count?: number) {
    let menu: Playlist
    if ([LOCAL_UUID, HISTORY_UUID, FAVORITE_UUID].includes(menuId)) {
      menu = getDefaultMenu(menuId)
    }
    else {
      menu = userMenus.value.find(item => item.id === menuId)!
    }
    menu.count = count ?? menu.count + 1
  }

  return {
    activeMenu,
    activeMenuInfo,
    defaultMenus,
    userMenus,
    updateMenuCount,
    getDefaultMenu,
    getUserMenus,
  }
})
