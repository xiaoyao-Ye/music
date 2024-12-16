import { defineStore } from 'pinia'

export const useMediaSessionStore = defineStore('mediaSession', () => {
  const isSupport = 'mediaSession' in navigator

  function updateMediaMetadata(music: AudioMetadata) {
    if (!isSupport)
      return

    navigator.mediaSession.metadata = new MediaMetadata({
      title: music.title,
      artist: music.artist,
      album: music.album,
      artwork: music.cover
        ? [{ src: music.cover, sizes: '512x512', type: 'image/jpeg' }]
        : undefined,
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
