import { defineStore } from 'pinia'

export const useMediaSessionStore = defineStore('mediaSession', () => {
  const isSupport = 'mediaSession' in navigator

  async function updateMediaMetadata(music: AudioMetadata) {
    if (!isSupport)
      return

    const base64 = await window.ipcRenderer.invoke('file:get-image-base64', music.cover)
    navigator.mediaSession.metadata = new MediaMetadata({
      title: music.title,
      artist: music.artist,
      album: music.album,
      artwork: [{ src: base64 }],
    })
  }

  function updateMediaPlayState(playing: boolean) {
    if (!isSupport)
      return

    navigator.mediaSession.playbackState = playing ? 'playing' : 'paused'
  }

  return {
    updateMediaMetadata,
    updateMediaPlayState,
  }
})
