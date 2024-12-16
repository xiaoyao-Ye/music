import { defineStore, storeToRefs } from 'pinia'
import { usePlayerCoreStore } from './player/core'
import { useMediaSessionStore } from './player/mediaSession'
import { usePlaylistStore } from './player/playList'
import { PlayMode, usePlayModeStore } from './player/playMode'

export const usePlayerStore = defineStore('player', () => {
  const playerCoreStore = usePlayerCoreStore()
  const mediaSessionStore = useMediaSessionStore()
  const playModeStore = usePlayModeStore()
  const playlistStore = usePlaylistStore()
  const { playlist, currentMusic, currentIndex } = storeToRefs(playlistStore)
  const { playing, muted, currentTime, duration, volumePercent, progressPercent } = storeToRefs(playerCoreStore)
  const { audio, setMusic, toggleMute } = playerCoreStore
  const { playMode } = storeToRefs(playModeStore)

  onMounted(() => {
    audio.onended = () => {
      playMode.value === PlayMode.Loop ? audio.play() : nextMusic()
    }
  })

  function prevMusic() {
    if (playlist.value.length === 0)
      return

    let prevIndex = currentIndex.value - 1
    if (prevIndex < 0)
      prevIndex = playlist.value.length - 1

    playMusic(playlist.value[prevIndex])
  }

  function nextMusic() {
    if (playlist.value.length === 0)
      return

    let newIndex: number

    if (playMode.value === PlayMode.Random) {
      // 随机模式：随机选择一首（排除当前歌曲）
      const availableIndices = Array.from(
        { length: playlist.value.length },
        (_, i) => i,
      ).filter(i => i !== currentIndex.value)

      newIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]
    }
    else {
      // 顺序模式：下一首
      newIndex = currentIndex.value + 1
      if (newIndex >= playlist.value.length)
        newIndex = 0
    }

    playMusic(playlist.value[newIndex])
  }

  // 播放控制
  function playMusic(music: AudioMetadata | undefined = currentMusic.value) {
    if (!music)
      return

    if (currentMusic.value?.path === music.path) {
      playing.value ? audio.pause() : audio.play()
      playing.value = !playing.value
    }
    else {
      currentMusic.value = music
      setMusic(`music://${music.path}`)
      mediaSessionStore.updateMediaMetadata(music)
    }

    mediaSessionStore.updateMediaPlayState(playing.value)
  }

  // 从头开始播放列表
  function playFromStart() {
    if (playMode.value === PlayMode.Random)
      playModeStore.togglePlayMode()

    playMusic(playlist.value[0])
  }

  // 开始随机播放
  function playRandom() {
    // 设置为随机播放模式
    playModeStore.setPlayMode(PlayMode.Random)

    // 随机选择一首歌开始播放
    const randomIndex = Math.floor(Math.random() * playlist.value.length)
    playMusic(playlist.value[randomIndex])
  }

  return {
    playlist,
    currentMusic,
    playMode,
    playing,
    muted,
    currentTime,
    duration,
    volumePercent,
    progressPercent,
    playMusic,
    nextMusic,
    prevMusic,
    playFromStart,
    playRandom,
    toggleMute,
    togglePlayMode: playModeStore.togglePlayMode,
    setPlaylist: playlistStore.setPlaylist,
  }
})
