<script setup lang="ts">
import { usePlayerStore } from '@/stores/player'

const playerStore = usePlayerStore()
const scrollTopEl = ref<HTMLElement>()
const showBackToTop = ref(false)

// 初始化时添加滚动监听
onMounted(() => {
  const handleScroll = () => {
    if (!scrollTopEl.value)
      return
    showBackToTop.value = scrollTopEl.value.scrollTop > 300
  }

  scrollTopEl.value?.addEventListener('scroll', handleScroll)

  // 清理监听器
  onUnmounted(() => {
    scrollTopEl.value?.removeEventListener('scroll', handleScroll)
  })
})

// 滚动到当前播放的音乐
function scrollToCurrentMusic() {
  if (!playerStore.currentMusic)
    return

  const currentMusicEl = document.querySelector(`[value="${playerStore.currentMusic.path}"]`)
  if (currentMusicEl) {
    currentMusicEl.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }
}

// 滚动到顶部
function scrollToTop() {
  scrollTopEl.value?.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>

<template>
  <div class="h-screen flex flex-col">
    <div class="flex flex-1 overflow-hidden">
      <Sidebar />

      <!-- 主内容区 -->
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
    </div>

    <Footer />

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
        v-show="showBackToTop"
        class="rounded-full shadow-lg transition-transform"
        variant="ghost"
        size="icon"
        @click="scrollToTop"
      >
        <div i-carbon:arrow-up class="text-lg" />
      </Button>
    </div>
  </div>
</template>
