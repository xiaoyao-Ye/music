import { MENU_INFO } from '@/config'
import { RECENT_UUID } from '@/config/menus'
import { defineStore, storeToRefs } from 'pinia'
import { usePlayerCoreStore } from './player/core'
import { PlayMode, usePlaylistStore } from './player/playList'

export const usePlayerStore = defineStore('player', () => {
  const playerCoreStore = usePlayerCoreStore()
  const playlistStore = usePlaylistStore()

  const { currentList, currentMusic, currentIndex, playMode } = storeToRefs(playlistStore)
  const { setCurrentMusic, setPlaylist, setPlayMode, togglePlayMode } = playlistStore
  const { playing, muted, volume, currentTime, duration, volumePercent, progressPercent } = storeToRefs(playerCoreStore)
  const { audio, play, toggleMute } = playerCoreStore

  onMounted(() => {
    audio.muted = muted.value
    audio.volume = volume.value
    if (currentMusic.value)
      audio.src = `music://${currentMusic.value.path}`
  })

  useEventListener(audio, 'ended', () => {
    playMode.value === PlayMode.Loop ? audio.play() : nextMusic()
  })

  // 更新最近播放列表
  function updateRecentPlaylist(music: AudioMetadata) {
    const recentList = useStorage<AudioMetadata[]>(RECENT_UUID, [])
    const menus = useStorage<CustomPlaylist[]>(MENU_INFO, [])

    const index = recentList.value.findIndex(item => item.path === music.path)
    if (index !== -1)
      recentList.value.splice(index, 1)

    recentList.value.unshift(music)

    if (recentList.value.length > 300)
      recentList.value.pop()
      // recentList.value = recentList.value.slice(0, 300)

    const recentPlaylist = menus.value.find(item => item.id === RECENT_UUID)
    if (recentPlaylist)
      recentPlaylist.count = recentList.value.length
  }

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
  function playMusic(music: AudioMetadata | undefined = currentMusic.value) {
    if (!music)
      return

    if (currentMusic.value?.path === music.path) {
      playing.value ? audio.pause() : audio.play()
    }
    else {
      playMusicFromStart(music)
    }
  }

  function playMusicFromStart(music: AudioMetadata) {
    setCurrentMusic(music)
    play(music)
    updateRecentPlaylist(music)
  }

  return {
    currentList,
    currentMusic,
    playMode,
    playing,
    muted,
    currentTime,
    duration,
    volumePercent,
    progressPercent,
    playMusicFromStart,
    playMusic,
    nextMusic,
    prevMusic,
    toggleMute,
    togglePlayMode,
    setPlayMode,
    setPlaylist,
  }
})
