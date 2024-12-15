<script setup lang="ts">
import { usePlayerStore } from '@/stores/player'

const playerStore = usePlayerStore()

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
    if (type === 'play' || type === 'pause')
      playerStore.playMusic()
    else if (type === 'previoustrack')
      playerStore.playPrev()
    else if (type === 'nexttrack')
      playerStore.playNext()
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
  <Layout />
</template>
