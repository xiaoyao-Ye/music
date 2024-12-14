<script setup lang="ts">
import { usePlayerStore } from '@/stores/player'

const playerStore = usePlayerStore()

const musicList = useStorage<AudioMetadata[]>('favorites-list', [])

onMounted(() => {
  playerStore.setPlaylist(musicList.value)
})
</script>

<template>
  <MusicList
    title="我喜欢的音乐"
    description="这里收藏了我最喜欢的音乐"
    :music-list="musicList"
  />
</template>
