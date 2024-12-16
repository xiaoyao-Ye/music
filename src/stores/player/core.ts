import { PLAY_MUTE, PLAY_VOLUME } from '@/config'
import { defineStore } from 'pinia'

export const usePlayerCoreStore = defineStore('playerCore', () => {
  const audio = new Audio()

  const playing = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = useStorage<number>(PLAY_VOLUME, 0.3)
  const muted = useStorage<boolean>(PLAY_MUTE, false)

  audio.onplaying = () => {
    playing.value = true
  }
  audio.onpause = () => {
    playing.value = false
  }
  audio.ontimeupdate = () => {
    currentTime.value = audio.currentTime
  }
  audio.onloadedmetadata = () => {
    duration.value = audio.duration
  }

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

  // 进度控制 - 直接返回数组格式
  const progressPercent = computed({
    get: () => {
      return [(currentTime.value / duration.value) * 100]
    },
    set: ([value]: number[]) => {
      currentTime.value = (value / 100) * duration.value
      audio.currentTime = currentTime.value
    },
  })

  // 初始化
  onMounted(() => {
    audio.muted = muted.value
    audio.volume = volume.value
  })

  function setMusic(url: string) {
    audio.src = url
    audio.play()
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
    setMusic,
  }
})
