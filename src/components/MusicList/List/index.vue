<script setup lang="ts">
import { usePlayerStore } from '@/stores/player'
import Item from './Item.vue'

const props = defineProps<{
  musicList: AudioMetadata[]
}>()

const playerStore = usePlayerStore()

function handlePlay(music: AudioMetadata) {
  playerStore.setPlaylist(props.musicList)
  playerStore.playMusic(music)
}
</script>

<template>
  <ToggleGroup type="single" class="flex-col">
    <ToggleGroupItem
      v-for="(music) in musicList"
      :key="music.path"
      :value="music.path"
      class="group h-auto w-full"
      :class="{ 'bg-stone-100 dark:bg-stone-800': music.path === playerStore.currentMusic?.path }"
      @dblclick="handlePlay(music)"
    >
      <Item
        :music="music"
        :is-playing="music.path === playerStore.currentMusic?.path && playerStore.isPlaying"
        @play="handlePlay(music)"
      />
    </ToggleGroupItem>
  </ToggleGroup>
</template>

<style scoped>
.group:hover {
  @apply bg-stone-50 dark:bg-stone-900;
}
</style>
