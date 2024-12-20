<script setup lang="ts">
import { MENU_INFO, USER_MENU_INFO } from '@/config'
import { usePlayerStore } from '@/stores/player'
import Footer from './Footer/index.vue'
import Header from './Header/index.vue'
import List from './List/index.vue'

const props = defineProps<{
  id: string
  showImport?: boolean
}>()

const playerStore = usePlayerStore()

const menus = useStorage<CustomPlaylist[]>(MENU_INFO, [])
const userMenus = useStorage<CustomPlaylist[]>(USER_MENU_INFO, [])
const menuList = [...menus.value, ...userMenus.value] // 避免更新菜单 count 属性时触发 watchEffect
const musicList = ref<AudioMetadata[]>([])
const menuInfo = ref<CustomPlaylist>({ id: '', title: '', description: '', count: 0 })

watchEffect(() => {
  menuInfo.value = menuList.find(item => item.id === props.id)!
  const list = useStorage<AudioMetadata[]>(props.id, [])
  musicList.value = list.value
})

const { list, containerProps, wrapperProps } = useVirtualList(musicList, { itemHeight: 60, overscan: 10 })

const { y: scrollTopY } = useScroll(containerProps.ref, { behavior: 'smooth' })

function scrollToCurrentMusic() {
  // isPlayingInList 为 true 一定是有值的
  const index = musicList.value.findIndex(item => item.path === playerStore.currentMusic?.path)
  const containerHeight = containerProps.ref.value?.clientHeight || 0
  // 计算目标位置（顶部信息栏 + 列表头部 + 当前音乐位置 - 容器高度的一半 + 单个项目高度的一半）
  const targetPosition = 318 + 45 + (index * 60) - (containerHeight / 2) + 30
  scrollTopY.value = Math.max(0, targetPosition)
}

function scrollToTop() {
  scrollTopY.value = 0
}
</script>

<template>
  <div v-bind="containerProps" class="h-full flex flex-col">
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
      <div v-bind="wrapperProps">
        <List :id="id" :music-list="musicList" :list="list" />

        <div v-if="musicList.length === 0" class="py-10 text-center text-sm text-stone-500">
          暂无音乐~
        </div>
      </div>

      <Footer :music-list="musicList" />
    </div>
  </div>
  <!-- 悬浮按钮组 -->
  <div class="fixed bottom-24 right-6 z-10 flex flex-col gap-2">
    <!-- 定位到当前音乐按钮 -->
    <Button
      v-show="playerStore.isPlayingInList"
      class="rounded-full shadow-lg transition-transform"
      variant="ghost"
      size="icon"
      @click="scrollToCurrentMusic"
    >
      <div i-carbon:airport-location class="text-lg" />
    </Button>

    <!-- 回到顶部按钮 -->
    <Button
      v-show="scrollTopY > 300"
      class="rounded-full shadow-lg transition-transform"
      variant="ghost"
      size="icon"
      @click="scrollToTop"
    >
      <div i-carbon:arrow-up class="text-lg" />
    </Button>
  </div>
</template>

<style scoped>

</style>
