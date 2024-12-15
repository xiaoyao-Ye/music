<script setup lang="ts">
import { usePlayerStore } from '@/stores/player'
import AudioController from './AudioController.vue'
import VolumeControl from './VolumeControl.vue'

const playerStore = usePlayerStore()
</script>

<template>
  <!-- 底部播放控制栏 -->
  <div class="h-20 flex items-center justify-between border-t border-stone-200 px-4 dark:border-stone-800">
    <!-- 当前播放信息 -->
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

    <!-- 播放控制器 -->
    <AudioController
      v-model:progress="playerStore.progressPercent"
      :is-playing="playerStore.isPlaying"
      :play-mode="playerStore.playMode"
      :current-time="playerStore.currentTime"
      :duration="playerStore.duration"
      @play="playerStore.playMusic"
      @prev="playerStore.playPrev"
      @next="playerStore.playNext"
      @toggle-mode="playerStore.togglePlayMode"
    />

    <!-- 音量控制 -->
    <VolumeControl
      v-model:volume="playerStore.volumePercent"
      :mute="playerStore.mute"
      @toggle-mute="playerStore.toggleMute"
    />
  </div>
</template>
