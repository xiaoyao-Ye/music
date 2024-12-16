import { PLAY_MODE } from '@/config'
import { defineStore } from 'pinia'

export enum PlayMode {
  Sequence = 'sequence',
  Loop = 'loop',
  Random = 'random',
}

export const usePlayModeStore = defineStore('playMode', () => {
  const playMode = useStorage<PlayMode>(PLAY_MODE, PlayMode.Sequence)

  function togglePlayMode() {
    const modes = Object.values(PlayMode)
    const currentIndex = modes.indexOf(playMode.value)
    const nextIndex = (currentIndex + 1) % modes.length
    setPlayMode(modes[nextIndex])
  }

  function setPlayMode(mode: PlayMode) {
    playMode.value = mode
  }

  // function getNextIndex(currentIndex: number, total: number): number {
  //   if (playMode.value === PlayMode.Random) {
  //     const availableIndices = Array.from(
  //       { length: total },
  //       (_, i) => i,
  //     ).filter(i => i !== currentIndex)
  //     return availableIndices[Math.floor(Math.random() * availableIndices.length)]
  //   }

  //   return (currentIndex + 1) % total
  // }

  return {
    playMode,
    togglePlayMode,
    setPlayMode,
    // getNextIndex,
  }
})
