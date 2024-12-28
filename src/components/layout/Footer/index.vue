<script setup lang="ts">
import AudioController from '@/components/Controller/AudioController.vue'
import VolumeControl from '@/components/Controller/VolumeControl.vue'
import { usePlayerStore } from '@/stores/player'
import { usePlaylistStore } from '@/stores/playList'

const playerStore = usePlayerStore()
const playlistStore = usePlaylistStore()
</script>

<template>
  <!-- 底部播放控制栏 -->
  <div class="h-20 flex items-center justify-between border-t border-stone-200 px-4 dark:border-stone-800">
    <!-- 当前播放信息 -->
    <div class="w-1/4 flex space-x-3">
      <div class="h-12 w-12 overflow-hidden rounded-md">
        <img
          v-if="playlistStore.currentMusic?.cover"
          :src="`music://${playlistStore.currentMusic?.cover}`"
          :alt="playlistStore.currentMusic?.title"
          class="h-full w-full object-cover"
        >
        <div v-else class="h-full w-full bg-stone-200 p-1 dark:bg-stone-700">
          <div i-game-icons:sound-on class="h-full w-full" />
        </div>
      </div>

      <div class="flex-1 truncate">
        <span class="text-sm font-medium">
          {{ playlistStore.currentMusic?.title || '未播放' }}
        </span>
      </div>
    </div>

    <!-- 播放控制器 -->
    <AudioController
      v-model:progress="playerStore.progressPercent"
      :playing="playerStore.playing"
      :play-mode="playlistStore.playMode"
      :current-time="playerStore.currentTime"
      :duration="playerStore.duration"
      @play="playerStore.togglePlayPause"
      @prev="playerStore.prevMusic"
      @next="playerStore.nextMusic"
      @toggle-mode="playlistStore.togglePlayMode"
    />

    <!-- 音量控制 -->
    <VolumeControl
      v-model:volume="playerStore.volumePercent"
      :muted="playerStore.muted"
      @toggle-mute="playerStore.toggleMute"
    />
  </div>
</template>
