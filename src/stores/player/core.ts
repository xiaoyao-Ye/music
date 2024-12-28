import { PLAY_MUTE, PLAY_VOLUME } from '@/config'
import { defineStore } from 'pinia'
import { useMediaSessionStore } from './mediaSession'

export const usePlayerCoreStore = defineStore('playerCore', () => {
  const mediaSessionStore = useMediaSessionStore()

  const audio = new Audio()

  const playing = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = useStorage<number>(PLAY_VOLUME, 0.3)
  const muted = useStorage<boolean>(PLAY_MUTE, false)

  useEventListener(audio, 'playing', () => {
    playing.value = true
    mediaSessionStore.updateMediaPlayState(true)
  })
  useEventListener(audio, 'pause', () => {
    playing.value = false
    mediaSessionStore.updateMediaPlayState(false)
  })
  const isDragging = ref(false)
  useEventListener(audio, 'timeupdate', () => {
    if (isDragging.value)
      return
    currentTime.value = audio.currentTime
  })
  useEventListener(audio, 'loadedmetadata', () => {
    duration.value = audio.duration
  })

  // 音量控制 - 直接返回数组格式
  const volumePercent = computed({
    get: () => [volume.value * 100],
    set: ([value]: number[]) => {
      volume.value = value / 100
      audio.volume = volume.value
      muted.value = volume.value === 0
      audio.muted = muted.value
    },
  })

  const debounceFn = useDebounceFn(() => {
    audio.currentTime = currentTime.value
    isDragging.value = false
  }, 400)

  // 进度控制 - 直接返回数组格式
  const progressPercent = computed({
    get: () => {
      return [(currentTime.value / duration.value) * 100]
    },
    set: ([value]: number[]) => {
      isDragging.value = true
      currentTime.value = (value / 100) * duration.value
      debounceFn()
    },
  })

  function play(music: AudioMetadata) {
    audio.src = `music://${music.path}`
    // audio.src = `file://${music.path}`
    // audio.src = `file://${music.path}`
    audio.play()
    mediaSessionStore.updateMediaMetadata(music)
    mediaSessionStore.updateMediaPlayState(true)
  }

  // 静音切换
  function toggleMute() {
    muted.value = !muted.value
    audio.muted = muted.value
  }

  return {
    audio,
    muted,
    volume,
    playing,
    currentTime,
    duration,
    volumePercent,
    progressPercent,
    toggleMute,
    play,
  }
})
