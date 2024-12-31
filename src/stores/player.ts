import { defineStore, storeToRefs } from 'pinia'
import { usePlayerCoreStore } from './player/core'
import { PlayMode, usePlaylistStore } from './playList'
import { useUserListStore } from './userList'

export const usePlayerStore = defineStore('player', () => {
  const playerCoreStore = usePlayerCoreStore()
  const userListStore = useUserListStore()
  const playlistStore = usePlaylistStore()

  const { currentList, currentMusic, currentIndex, playMode } = storeToRefs(playlistStore)
  const { playing, muted, volume, currentTime, duration, volumePercent, progressPercent } = storeToRefs(playerCoreStore)
  const { audio, setAudioSource, toggleMute } = playerCoreStore
  const { addToHistoryList } = userListStore

  onMounted(() => {
    audio.muted = muted.value
    audio.volume = volume.value
    if (currentMusic.value) {
      setAudioSource(currentMusic.value)
    }
  })

  useEventListener(audio, 'ended', () => {
    playMode.value === PlayMode.Loop ? audio.play() : nextMusic()
  })

  function prevMusic() {
    if (currentList.value.length === 0)
      return

    let prevIndex = currentIndex.value - 1
    if (prevIndex < 0)
      prevIndex = currentList.value.length - 1

    playMusicFromStart(currentList.value[prevIndex])
  }

  function nextMusic() {
    if (currentList.value.length === 0)
      return

    let nextIndex = currentIndex.value + 1
    if (nextIndex >= currentList.value.length)
      nextIndex = 0

    playMusicFromStart(currentList.value[nextIndex])
  }

  // 播放控制
  function togglePlayPause() {
    if (!currentMusic.value)
      return

    playing.value ? audio.pause() : audio.play()
  }

  function playMusicFromStart(music: AudioMetadata) {
    playlistStore.setCurrentMusic(music)
    setAudioSource(music)
    audio.play()
    addToHistoryList(music)
  }

  return {
    playing,
    muted,
    currentTime,
    duration,
    volumePercent,
    progressPercent,
    playMusicFromStart,
    togglePlayPause,
    nextMusic,
    prevMusic,
    toggleMute,
  }
})
