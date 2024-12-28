<script setup lang="ts">
import { formatDuration } from '@/lib'

defineProps<{
  music: AudioMetadata
  playing: boolean
}>()

const emit = defineEmits(['play'])

function handlePlay() {
  emit('play')
}
</script>

<template>
  <div class="w-full flex items-center gap-4 rounded-md py-2 text-left text-sm">
    <div class="flex flex-1 items-center gap-3">
      <div
        class="relative h-10 w-10 overflow-hidden rounded bg-stone-200 dark:bg-stone-700"
      >
        <!-- 播放状态指示 -->
        <div
          class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100"
          @click.stop="handlePlay"
          @dblclick.stop
        >
          <div
            class="z-1 cursor-pointer text-xl text-white"
            :class="[
              playing ? 'i-carbon:pause' : 'i-carbon:play',
            ]"
          />
        </div>
        <!-- 封面图片 -->
        <img
          v-if="music.cover"
          :src="`music://${music.cover}`"
          decoding="async"
          :alt="music.title"
          class="h-full w-full object-cover"
        >
        <div v-else class="h-full w-full p-1">
          <div i-game-icons:sound-on class="h-full w-full" />
        </div>
      </div>
      <span class="truncate lg:max-w-xs sm:max-w-50">
        {{ music.title }}
      </span>
    </div>
    <div class="w-25 text-stone-500">
      {{ music.artist }}
    </div>
    <div class="truncate text-stone-500 lg:w-40 sm:w-30">
      {{ music.album }}
    </div>
    <div class="w-15 text-right text-stone-500">
      {{ formatDuration(music.duration) }}
    </div>
  </div>
</template>

<style scoped>

</style>
