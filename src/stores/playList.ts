import { PLAYLIST } from '@/config'
import { defineStore } from 'pinia'

export enum PlayMode {
  Sequence = 'sequence',
  Loop = 'loop',
  Random = 'random',
}

interface PlaylistState {
  playlists: {
    [PlayMode.Sequence]: AudioMetadata[]
    [PlayMode.Random]: AudioMetadata[]
  }
  playMode: PlayMode
  currentMusic: AudioMetadata | undefined
}

export const usePlaylistStore = defineStore('playlist', () => {
  // const playMode = useStorage<PlayMode>(PLAY_MODE, PlayMode.Sequence)
  const state = useStorage<PlaylistState>(PLAYLIST, {
  // const state = useElectronStore<PlaylistState>(PLAYLIST, {
    playlists: {
      [PlayMode.Sequence]: [],
      [PlayMode.Random]: [],
    },
    playMode: PlayMode.Sequence,
    currentMusic: undefined,
  })

  const listMode = computed(() => {
    return state.value.playMode === PlayMode.Random ? PlayMode.Random : PlayMode.Sequence
  })

  const currentList = computed(() => {
    return state.value.playlists[listMode.value]
  })

  function togglePlayMode() {
    const modes = Object.values(PlayMode)
    const index = modes.indexOf(state.value.playMode)
    const nextIndex = (index + 1) % modes.length
    setPlayMode(modes[nextIndex])
  }

  function setPlayMode(mode: PlayMode) {
    state.value.playMode = mode

    setRandomList(state.value.playlists[PlayMode.Sequence])
  }

  function setRandomList(list: AudioMetadata[]) {
    if (state.value.playMode !== PlayMode.Random)
      return

    state.value.playlists[PlayMode.Random] = getRandomList(list)
  }

  function getRandomList(list: AudioMetadata[]) {
    if (list.length === 0)
      return []

    const randomList = [...list]
    for (let i = randomList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomList[i], randomList[j]] = [randomList[j], randomList[i]]
    }
    return randomList
  }

  function setPlaylist(list: AudioMetadata[]) {
    if (list.length === 0)
      return

    state.value.playlists[PlayMode.Sequence] = [...list]
    setRandomList(list)
  }

  const currentIndex = computed(() => {
    if (!state.value.currentMusic)
      return -1
    return currentList.value.findIndex(music => music.path === state.value.currentMusic?.path)
  })

  // 插入到下一首播放
  function insertNextTrack(music: AudioMetadata) {
    // 如果歌曲已经在列表中，先移除它
    const index = currentList.value.findIndex(item => item.path === music.path)
    if (index !== -1)
      currentList.value.splice(index, 1)

    // 插入到当前播放歌曲的下一个位置
    const insertIndex = currentIndex.value + 1
    currentList.value.splice(insertIndex, 0, music)
  }

  function setCurrentMusic(music: AudioMetadata | undefined) {
    state.value.currentMusic = music
  }

  return {
    currentList,
    currentIndex,
    currentMusic: computed(() => state.value.currentMusic),
    playMode: computed(() => state.value.playMode),
    insertNextTrack,
    togglePlayMode,
    setPlayMode,
    setPlaylist,
    setCurrentMusic,
  }
})
