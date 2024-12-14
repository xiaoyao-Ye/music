<script setup lang="ts">
import { usePlayerStore } from '@/stores/player'

const playerStore = usePlayerStore()

// 滚动到顶部
const scrollTopEl = ref<HTMLElement>()
const { y: scrollTopY } = useScroll(scrollTopEl, { behavior: 'smooth' })

// 滚动到当前播放的音乐
function scrollToCurrentMusic() {
  const currentMusicEl = document.querySelector(`[value="${playerStore.currentMusic!.path}"]`)
  if (currentMusicEl) {
    currentMusicEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

// 空格键控制播放/暂停
onKeyStroke(' ', (e) => {
  // 如果正在输入，不处理快捷键
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
    return
    // 阻止空格键的默认行为（页面滚动）
  e.preventDefault()
  playerStore.playMusic()
}, { eventName: 'keydown' })

// 初始化时添加媒体按键监听
onMounted(() => {
  // 初始化
  playerStore.init()
  // 媒体按键监听
  const handleMediaKeys = (type: MediaSessionAction) => {
    if (type === 'play' || type === 'pause') {
      playerStore.playMusic()
    }
    else if (type === 'previoustrack') {
      playerStore.playPrev()
    }
    else if (type === 'nexttrack') {
      playerStore.playNext()
    }
  }

  // 设置 MediaSession
  function setMediaSession(fn: ((type: MediaSessionAction) => void) | null) {
    const mediaSessions: MediaSessionAction[] = ['play', 'pause', 'previoustrack', 'nexttrack']
    mediaSessions.forEach((session) => {
      const handler = fn ? () => fn(session) : null
      navigator.mediaSession.setActionHandler(session, handler)
    })
  }
  setMediaSession(handleMediaKeys)

  // 清理 MediaSession
  onUnmounted(() => {
    setMediaSession(null)
  })
})
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
        v-show="scrollTopY > 300"
        class="rounded-full shadow-lg transition-transform"
        variant="ghost"
        size="icon"
        @click="scrollTopY = 0"
      >
        <div i-carbon:arrow-up class="text-lg" />
      </Button>
    </div>
  </div>
</template>
