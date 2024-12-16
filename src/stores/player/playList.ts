import { PLAYLIST } from '@/config'
import { defineStore } from 'pinia'

export const usePlaylistStore = defineStore('playlist', () => {
  const playlist = useStorage<AudioMetadata[]>(PLAYLIST, [])
  const currentMusic = ref<AudioMetadata | undefined>()

  function setPlaylist(list: AudioMetadata[]) {
    if (list.length === 0)
      return

    playlist.value = list
  }

  const currentIndex = computed(() => {
    if (!currentMusic.value)
      return -1
    return playlist.value.findIndex(music => music.path === currentMusic.value?.path)
  })

  return {
    playlist,
    currentMusic,
    currentIndex,
    setPlaylist,
  }
})
