<script setup lang="ts">
import { PlayMode, usePlayerStore } from '@/stores/player'
import { formatDuration } from '@/utils/format'

const playerStore = usePlayerStore()

// 音量控制
const volume = computed({
  get: () => [playerStore.volume * 100],
  set: ([value]) => {
    if (typeof value === 'number')
      playerStore.setVolume(value)
  },
})

// 进度控制
const progress = computed({
  get: () => {
    if (!playerStore.duration)
      return [0]
    return [(playerStore.currentTime / playerStore.duration) * 100]
  },
  set: ([value]) => {
    if (typeof value === 'number')
      playerStore.setProgress(value)
  },
})

// 播放/暂停切换
function togglePlay() {
  if (playerStore.currentMusic)
    playerStore.playMusic()
  else
    playerStore.playMusic(playerStore.playlist[0])
}

// 播放模式图标映射
const playModeIcon = computed(() => {
  switch (playerStore.playMode) {
    case PlayMode.Loop:
      return 'i-carbon:repeat-one'
    case PlayMode.Random:
      return 'i-carbon:shuffle'
    default:
      return 'i-carbon:repeat'
  }
})
</script>

<template>
  <!-- 底部播放控制栏 -->
  <div class="h-20 flex items-center justify-between border-t border-stone-200 px-4 dark:border-stone-800">
    <div class="w-1/4 flex space-x-3">
      <div class="h-12 w-12 rounded-md bg-stone-200 p-1 dark:bg-stone-700">
        <div i-game-icons:sound-on class="h-full w-full" />
      </div>
      <div class="flex-1 truncate">
        <span class="text-sm font-medium">
          {{ playerStore.currentMusic?.title || '未播放' }}
        </span>
      </div>
    </div>

    <div class="w-2/4 flex flex-col px-8">
      <div class="flex items-center justify-center">
        <!-- 播放模式 -->
        <Button
          variant="ghost"
          @click="playerStore.togglePlayMode"
        >
          <div :class="playModeIcon" />
        </Button>
        <Button
          variant="ghost"
          @click="playerStore.playPrev"
        >
          <div i-carbon:triangle-left-outline />
        </Button>
        <Button
          variant="ghost"
          size="lg"
          @click="togglePlay"
        >
          <div
            text-lg
            :class="playerStore.isPlaying ? 'i-carbon-pause' : 'i-carbon-play-outline'"
          />
        </Button>
        <Button
          variant="ghost"
          @click="playerStore.playNext"
        >
          <div i-carbon:triangle-right-outline />
        </Button>
        <div class="w-12" />
      </div>
      <div class="mt-1 flex items-center justify-center gap-3">
        <span class="text-xs text-stone-500">
          {{ formatDuration(playerStore.currentTime) }}
        </span>
        <div class="slider h-1 w-xs">
          <Slider
            v-model="progress"
            :max="100"
            :step="0.1"
          />
        </div>
        <span class="text-xs text-stone-500">
          {{ formatDuration(playerStore.duration) }}
        </span>
      </div>
    </div>

    <!-- 音量控制 -->
    <div class="w-1/4 flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <div
          class="cursor-pointer"
          :class="[playerStore.mute ? 'i-carbon:volume-mute' : 'i-carbon:volume-up']"
          @click="playerStore.toggleMute"
        />
        <div class="slider w-25">
          <Slider
            v-model="volume"
            :max="100"
            :step="1"
          />
        </div>
      </div>

      <Button variant="ghost" size="icon">
        <div i-carbon-list />
      </Button>
    </div>
  </div>
</template>

<style scoped>
:deep(.slider) * {
  outline: none;
  box-shadow: none;
}
</style>
