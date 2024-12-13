<script setup lang="ts">
import { usePlayerStore } from '@/stores/player'

const playerStore = usePlayerStore()

// 播放/暂停切换
function togglePlay() {
  if (playerStore.currentMusic)
    playerStore.playMusic(playerStore.currentMusic)
}
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
        <Button variant="ghost">
          <div i-carbon:edt-loop />
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
        <Button variant="ghost">
          <div i-carbon:volume-up />
          <!-- <div i-carbon:volume-mute />
          <div i-carbon:volume-down />
          <div i-carbon:volume-down-alt />
          <div i-carbon:volume-up-alt /> -->
        </Button>
      </div>
      <div class="mt-2 flex items-center gap-3">
        <span class="text-xs text-stone-500">00:00</span>
        <div class="h-1 w-sm flex-1 rounded-full bg-stone-200 dark:bg-stone-700">
          <div class="h-full w-1/3 rounded-full bg-stone-500" />
        </div>
        <span class="text-xs text-stone-500">00:00</span>
      </div>
    </div>

    <div class="w-1/4 flex items-center justify-end gap-2">
      <Button variant="ghost" size="icon">
        <div i-carbon-list />
      </Button>
    </div>
  </div>
</template>

<style scoped>

</style>
