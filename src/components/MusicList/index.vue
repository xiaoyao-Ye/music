<script setup lang="ts">
import { MENU_INFO, USER_MENU_INFO } from '@/config'
import Footer from './Footer/index.vue'
import Header from './Header/index.vue'
import List from './List/index.vue'

const props = defineProps<{
  id: string
  showImport?: boolean
}>()

const menus = useStorage<CustomPlaylist[]>(MENU_INFO, [])
const userMenus = useStorage<CustomPlaylist[]>(USER_MENU_INFO, [])
const musicList = useStorage<AudioMetadata[]>(props.id, [])
let menuInfo: CustomPlaylist

watchEffect(() => {
  menuInfo = [...menus.value, ...userMenus.value].find(item => item.id === props.id)!
})
</script>

<template>
  <div class="h-full flex flex-col">
    <Header
      :info="menuInfo"
      :music-list="musicList"
      :show-import="showImport"
    />

    <!-- 歌曲列表 -->
    <div class="flex-1 px-6">
      <!-- 列表头部 -->
      <div class="flex items-center gap-4 border-b border-stone-200 p-3 text-sm text-stone-500 font-medium dark:border-stone-800">
        <div class="flex-1">
          歌曲
        </div>
        <div class="w-25">
          艺人
        </div>
        <div class="lg:w-40 sm:w-30">
          专辑
        </div>
        <div class="w-15 text-right">
          时长
        </div>
      </div>

      <!-- 歌曲列表项 -->
      <div class="mt-2">
        <List :music-list="musicList" />

        <div v-if="musicList.length === 0" class="py-10 text-center text-sm text-stone-500">
          暂无音乐~
        </div>
      </div>

      <Footer :music-list="musicList" />
    </div>
  </div>
</template>

<style scoped>

</style>
