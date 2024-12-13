import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', () => {
  // 状态
  const currentMusic = ref<AudioMetadata | null>(null)
  const isPlaying = ref(false)
  const audioPlayer = ref<HTMLAudioElement | null>(null)
  const playlist = ref<AudioMetadata[]>([])

  // 初始化
  function init() {
    if (!audioPlayer.value) {
      audioPlayer.value = new Audio()
      audioPlayer.value.addEventListener('ended', () => {
        isPlaying.value = false
        // 播放结束后自动播放下一首
        playNext()
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

    let newIndex = currentIndex.value + 1
    if (newIndex >= playlist.value.length)
      newIndex = 0

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
      return
    }

    // 播放新的歌曲
    currentMusic.value = music
    audioPlayer.value.src = `music://${music.path}`
    audioPlayer.value.play()
    isPlaying.value = true
  }

  return {
    currentMusic,
    isPlaying,
    playlist,
    currentIndex,
    init,
    setPlaylist,
    playMusic,
    playNext,
    playPrev,
  }
})
