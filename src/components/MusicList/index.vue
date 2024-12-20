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

const itemHeight = 60
const topBarHeight = 318 + 45
// 超过 70 个项目时, 滚动范围太大可能会导致页面空白
// 用于处理大范围滚动空白 scrollTop 无动画, scrollTopY 有动画
const blankCount = 70

const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(musicList, { itemHeight, overscan: 12 })

const { y: scrollTopY } = useScroll(containerProps.ref, { behavior: 'smooth', throttle: 400 })

function scrollToCurrentMusic() {
  // isPlayingInList 为 true 一定是有值的
  const index = musicList.value.findIndex(item => item.path === playerStore.currentMusic?.path)
  const containerHeight = containerProps.ref.value?.clientHeight || 0
  // 计算目标位置（顶部信息栏 + 列表头部 + 当前音乐位置 - 容器高度的一半 + 单个项目高度的一半）
  const targetPosition = topBarHeight + (index * itemHeight) - (containerHeight / 2) + itemHeight / 2
  const diffValue = scrollTopY.value - targetPosition

  if (Math.abs(diffValue) > itemHeight * blankCount) {
    const targetIndex = diffValue > 0 ? index + blankCount : index - blankCount
    scrollTo(targetIndex)
  }

  scrollTopY.value = Math.max(0, targetPosition)
}

function scrollToTop() {
  if (scrollTopY.value > itemHeight * blankCount)
    scrollTo(blankCount)

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
