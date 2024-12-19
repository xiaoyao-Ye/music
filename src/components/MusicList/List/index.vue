<script setup lang="ts">
import { usePlayerStore } from '@/stores/player'
import Item from './Item.vue'
import PlaylistMenu from './PlaylistMenu.vue'

const props = defineProps<{
  musicList: AudioMetadata[]
  id: string
}>()

const playerStore = usePlayerStore()

function handlePlay(music: AudioMetadata) {
  playerStore.setPlaylist(props.musicList)
  playerStore.playMusic(music)
}

function handlePlayFromStart(music: AudioMetadata) {
  playerStore.setPlaylist(props.musicList)
  playerStore.playMusicFromStart(music)
}

function handlePlayNext(music: AudioMetadata) {
  playerStore.insertNextTrack(music)
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
      @dblclick="handlePlayFromStart(music)"
    >
      <div class="w-full">
        <PlaylistMenu
          :id="id"
          :music="music"
          @play="handlePlayFromStart(music)"
          @play-next="handlePlayNext(music)"
        >
          <Item
            :music="music"
            :playing="music.path === playerStore.currentMusic?.path && playerStore.playing"
            @play="handlePlay(music)"
          />
        </PlaylistMenu>
      </div>
    </ToggleGroupItem>
  </ToggleGroup>
</template>

<style scoped>
.group:hover {
  @apply bg-stone-50 dark:bg-stone-900;
}
</style>
