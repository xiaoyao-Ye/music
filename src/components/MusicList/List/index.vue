<script setup lang="ts">
import type { UseVirtualListItem } from '@vueuse/core'
import { usePlayerStore } from '@/stores/player'
import { usePlaylistStore } from '@/stores/playList'
import { useUserListStore } from '@/stores/userList'
import Item from './Item.vue'
import PlaylistMenu from './PlaylistMenu.vue'

const props = defineProps<{
  musicList: AudioMetadata[]
  list: UseVirtualListItem<AudioMetadata>[]
}>()

const playerStore = usePlayerStore()
const playlistStore = usePlaylistStore()
const userListStore = useUserListStore()

function handlePlay(music: AudioMetadata) {
  playlistStore.setPlaylist(props.musicList)
  if (isCurrentMusicId(music)) {
    playerStore.togglePlayPause()
  }
  else {
    playerStore.playMusicFromStart(music)
  }
}

function handlePlayFromStart(music: AudioMetadata) {
  playlistStore.setPlaylist(props.musicList)
  playerStore.playMusicFromStart(music)
}

function handlePlayNext(music: AudioMetadata) {
  // 如果当前没有播放列表，直接播放这首歌
  if (playlistStore.currentList.length === 0) {
    playlistStore.setPlaylist([music])
    playerStore.playMusicFromStart(music)
    return
  }

  playlistStore.insertNextTrack(music)
}

function toggleFavorite(music: AudioMetadata) {
  userListStore.toggleFavorite(music)
}

function isCurrentMusicId(music: AudioMetadata) {
  return music.id === playlistStore.currentMusic?.id
}

const ctxMusic = ref<AudioMetadata>() as Ref<AudioMetadata>
function handleContextmenu(event: Event) {
  const item = (event.target as HTMLElement)?.closest('.group')
  // 如果不是 item 元素, 则不处理
  if (!item)
    return event.preventDefault()

  const id = item.getAttribute('value')
  ctxMusic.value = props.musicList.find(music => music.id === Number(id))!
}
</script>

<template>
  <PlaylistMenu
    :music="ctxMusic"
    @play="handlePlayFromStart(ctxMusic)"
    @play-next="handlePlayNext(ctxMusic)"
    @toggle-favorite="toggleFavorite(ctxMusic)"
  >
    <ToggleGroup
      type="single" class="flex-col gap-0"
      @contextmenu="handleContextmenu"
    >
      <ToggleGroupItem
        v-for="({ data: music }) in list"
        :key="music.id"
        :value="music.id.toString()"
        class="group mt-1 h-auto w-full"
        :class="{ 'bg-stone-100 dark:bg-stone-800': isCurrentMusicId(music) }"
        @dblclick="handlePlayFromStart(music)"
      >
        <Item
          :music="music"
          :playing="isCurrentMusicId(music) && playerStore.playing"
          @play="handlePlay(music)"
          @toggle-favorite="toggleFavorite(music)"
        />
      </ToggleGroupItem>
    </ToggleGroup>
  </PlaylistMenu>
</template>

<style scoped>
</style>
