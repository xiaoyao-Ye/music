<script setup lang="ts">
import { usePlayerStore } from '@/stores/player'

const playerStore = usePlayerStore()

// 滚动到当前播放的音乐
function scrollToCurrentMusic() {
  const currentMusicEl = document.querySelector(`[value="${playerStore.currentMusic!.path}"]`)
  if (currentMusicEl)
    currentMusicEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

const scrollTopEl = ref<HTMLElement>()
const { y: scrollTopY } = useScroll(scrollTopEl, { behavior: 'smooth' })
</script>

<template>
  <main class="flex flex-1 flex-col dark:bg-stone-900">
    <!-- 设置区域 -->
    <div class="h-12 flex justify-end gap-2 px-4">
      <button icon-btn>
        <div i-carbon-settings />
      </button>

      <button icon-btn @click="toggleDark()">
        <div i-carbon-sun dark:i-carbon-moon />
      </button>
    </div>

    <div
      ref="scrollTopEl"
      class="flex-1 overflow-y-scroll"
    >
      <RouterView />
    </div>
  </main>
  <!-- 悬浮按钮组 -->
  <div class="fixed bottom-24 right-6 z-10 flex flex-col gap-2">
    <!-- 定位到当前音乐按钮 -->
    <Button
      v-show="playerStore.currentMusic"
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
      @click="scrollTopY = 0"
    >
      <div i-carbon:arrow-up class="text-lg" />
    </Button>
  </div>
</template>

<style scoped>

</style>
