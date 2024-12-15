<script setup lang="ts">
import { PlayMode } from '@/stores/player'
import { formatDuration } from '@/utils/format'

const props = defineProps<{
  isPlaying: boolean
  playMode: PlayMode
  currentTime: number
  duration: number
  progress: number[]
}>()

const emit = defineEmits<{
  'play': []
  'prev': []
  'next': []
  'toggleMode': []
  'update:progress': [value: number[]]
}>()

// 播放模式图标映射
const playModeIcon = computed(() => {
  switch (props.playMode) {
    case PlayMode.Loop:
      return 'i-carbon:repeat-one'
    case PlayMode.Random:
      return 'i-carbon:shuffle'
    default:
      return 'i-carbon:repeat'
  }
})

const progress = useVModel(props, 'progress', emit)
</script>

<template>
  <div class="w-2/4 flex flex-col px-8">
    <div class="flex items-center justify-center">
      <!-- 播放模式 -->
      <Button
        variant="ghost"
        @click="emit('toggleMode')"
      >
        <div :class="playModeIcon" />
      </Button>
      <Button
        variant="ghost"
        @click="emit('prev')"
      >
        <div i-carbon:triangle-left-outline />
      </Button>
      <Button
        variant="ghost"
        size="lg"
        @click="emit('play')"
      >
        <div
          text-lg
          :class="isPlaying ? 'i-carbon-pause' : 'i-carbon-play-outline'"
        />
      </Button>
      <Button
        variant="ghost"
        @click="emit('next')"
      >
        <div i-carbon:triangle-right-outline />
      </Button>
      <div class="w-12" />
    </div>

    <!-- 进度控制 -->
    <div class="mt-1 flex items-center justify-center gap-3">
      <span class="text-xs text-stone-500">
        {{ formatDuration(currentTime) }}
      </span>
      <div class="slider h-1 w-xs">
        <Slider
          v-model="progress"
          :max="100"
          :step="0.1"
        />
      </div>
      <span class="text-xs text-stone-500">
        {{ formatDuration(duration) }}
      </span>
    </div>
  </div>
</template>

<style scoped>
:deep(.slider) * {
  outline: none;
  box-shadow: none;
}
</style>
