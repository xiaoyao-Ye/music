import { defineStore } from 'pinia'

// 播放模式枚举
export enum PlayMode {
  Sequence = 'sequence', // 顺序播放
  Loop = 'loop', // 单曲循环
  Random = 'random', // 随机播放
}

export const usePlayerStore = defineStore('player', () => {
  // 状态
  const currentMusic = ref<AudioMetadata | null>(null)
  const isPlaying = ref(false)
  const audioPlayer = ref<HTMLAudioElement | null>(null)
  const playlist = ref<AudioMetadata[]>([])
  const volume = ref(0.3) // 音量范围 0-1
  const mute = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const playMode = ref<PlayMode>(PlayMode.Sequence)

  // 初始化
  function init() {
    if (!audioPlayer.value) {
      audioPlayer.value = new Audio()
      // 设置初始音量
      audioPlayer.value.volume = volume.value
      audioPlayer.value.addEventListener('ended', () => {
        isPlaying.value = false
        // 根据播放模式决定下一首
        if (playMode.value === PlayMode.Loop) {
          // 单曲循环，重新播放当前歌曲
          audioPlayer.value?.play()
          isPlaying.value = true
        }
        else {
          // 顺序或随机播放下一首
          playNext()
        }
      })

      // 监听时间更新
      audioPlayer.value.addEventListener('timeupdate', () => {
        currentTime.value = audioPlayer.value?.currentTime || 0
      })

      // 监听音频加载完成
      audioPlayer.value.addEventListener('loadedmetadata', () => {
        duration.value = audioPlayer.value?.duration || 0
      })
    }
  }

  // 设置播放列表
  function setPlaylist(list: AudioMetadata[]) {
    playlist.value = list
  }

  // 获取当前歌曲在播放列表中的索引
  const currentIndex = computed(() => {
    if (!currentMusic.value)
      return -1
    return playlist.value.findIndex(music => music.path === currentMusic.value?.path)
  })

  // 播放上一首
  function playPrev() {
    if (playlist.value.length === 0)
      return

    let newIndex = currentIndex.value - 1
    if (newIndex < 0)
      newIndex = playlist.value.length - 1

    playMusic(playlist.value[newIndex])
  }

  // 播放下一首
  function playNext() {
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
  function playMusic(music: AudioMetadata) {
    if (!audioPlayer.value)
      return

    // 如果是同一首歌
    if (currentMusic.value?.path === music.path) {
      if (isPlaying.value)
        audioPlayer.value.pause()
      else
        audioPlayer.value.play()

      isPlaying.value = !isPlaying.value

      // 更新媒体会话状态
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = isPlaying.value ? 'playing' : 'paused'
      }
      return
    }

    // 播放新的歌曲
    currentMusic.value = music
    audioPlayer.value.src = `music://${music.path}`
    audioPlayer.value.play()
    isPlaying.value = true

    // 更新媒体会话信息
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: music.title,
        artist: music.artist,
        album: music.album,
        artwork: music.cover
          ? [{ src: music.cover, sizes: '512x512', type: 'image/jpeg' }]
          : undefined,
      })
      navigator.mediaSession.playbackState = 'playing'
    }
  }

  // 设置音量
  function setVolume(value: number) {
    if (!audioPlayer.value)
      return

    // 将百分比转换为 0-1 范围
    const normalizedVolume = value / 100
    volume.value = normalizedVolume
    audioPlayer.value.volume = normalizedVolume
    mute.value = volume.value === 0
  }

  // 静音切换
  function toggleMute() {
    if (!audioPlayer.value)
      return

    if (audioPlayer.value.volume > 0) {
      audioPlayer.value.volume = 0
      mute.value = true
    }
    else {
      audioPlayer.value.volume = volume.value
      mute.value = false
    }
  }

  // 设置播放进度
  function setProgress(value: number) {
    if (!audioPlayer.value)
      return

    const time = (value / 100) * duration.value
    audioPlayer.value.currentTime = time
    currentTime.value = time
  }

  // 切换播放模式
  function togglePlayMode() {
    const modes = Object.values(PlayMode)
    const currentIndex = modes.indexOf(playMode.value)
    const nextIndex = (currentIndex + 1) % modes.length
    playMode.value = modes[nextIndex]
  }

  // 从头开始播放列表
  function playFromStart() {
    if (playlist.value.length === 0)
      return

    if (playMode.value === PlayMode.Random)
      togglePlayMode()

    playMusic(playlist.value[0])
  }

  // 开始随机播放
  function playRandom() {
    if (playlist.value.length === 0)
      return

    // 设置为随机播放模式
    playMode.value = PlayMode.Random

    // 随机选择一首歌开始播放
    const randomIndex = Math.floor(Math.random() * playlist.value.length)
    playMusic(playlist.value[randomIndex])
  }

  return {
    currentMusic,
    isPlaying,
    mute,
    playlist,
    currentIndex,
    volume,
    init,
    setPlaylist,
    playMusic,
    playNext,
    playPrev,
    setVolume,
    toggleMute,
    currentTime,
    duration,
    setProgress,
    playMode,
    togglePlayMode,
    playFromStart,
    playRandom,
  }
})
