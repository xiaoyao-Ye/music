<script setup lang="ts">
import { formatDuration } from '@/lib'

defineProps<{
  music: AudioMetadata
  playing: boolean
}>()

const emit = defineEmits(['play', 'toggleFavorite'])

function handlePlay() {
  emit('play')
}

function toggleFavorite() {
  emit('toggleFavorite')
}
</script>

<template>
  <div class="w-full flex items-center gap-4 rounded-md py-2 text-left text-sm">
    <div class="flex flex-1 items-center gap-3 overflow-hidden">
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
      <div class="h-10 flex flex-1 flex-col justify-between overflow-hidden">
        <div class="truncate">
          {{ music.title }}
        </div>
        <div class="truncate text-xs text-stone-500">
          {{ music.artist }}
        </div>
      </div>
      <div class="px-2">
        <div
          class="cursor-pointer text-stone-500 hover:text-red-500"
          :class="[music.isFavorite ? 'i-carbon:favorite-filled text-red-500' : 'i-carbon:favorite']"
          @click="toggleFavorite"
        />
      </div>
    </div>
    <div class="w-[25%] truncate text-stone-500">
      {{ music.album }}
    </div>
    <div class="w-20 text-right text-stone-500">
      {{ formatDuration(music.duration) }}
    </div>
  </div>
</template>

<style scoped>

</style>
