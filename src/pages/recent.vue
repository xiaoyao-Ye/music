<script setup lang="ts">
import { usePlayerStore } from '@/stores/player'

const playerStore = usePlayerStore()

const musicList = useStorage<AudioMetadata[]>('recent-list', [])

onMounted(() => {
  playerStore.setPlaylist(musicList.value)
})
</script>

<template>
  <MusicList
    title="最近播放"
    description="这里是最近播放过的音乐"
    :music-list="musicList"
  />
</template>
