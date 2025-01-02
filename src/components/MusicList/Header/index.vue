<script setup lang="ts">
import { LOCAL_UUID } from '@/config/menus'
import { useMenuStore } from '@/stores/menu'
import { usePlayerStore } from '@/stores/player'
import { PlayMode, usePlaylistStore } from '@/stores/playList'
import { useUserListStore } from '@/stores/userList'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import ImportMusic from './ImportMusic.vue'

const playerStore = usePlayerStore()
const userListStore = useUserListStore()
const menuStore = useMenuStore()
const playlistStore = usePlaylistStore()

const { activeMenuInfo } = storeToRefs(menuStore)

// 是否禁用播放按钮
const isDisabled = computed(() => !userListStore.musicList.length)
// 是否显示导入按钮
const showImport = computed(() => activeMenuInfo.value.id === LOCAL_UUID)

// 播放功能
function handlePlay() {
  playlistStore.setPlaylist(userListStore.musicList)
  if (playlistStore.playMode === PlayMode.Random)
    playlistStore.togglePlayMode()
  playerStore.playMusicFromStart(playlistStore.currentList[0])
}

// 随机播放功能
function handleRandomPlay() {
  playlistStore.setPlaylist(userListStore.musicList)
  playlistStore.setPlayMode(PlayMode.Random)
  playerStore.playMusicFromStart(playlistStore.currentList[0])
}

// 处理文件更新
async function handleFilesUpdate(files: AudioMetadata[]) {
  // 过滤掉重复的文件
  // const exportMusics = files.filter((file) => {
  //   return !userListStore.musicList.some(({ path }) => path === file.path)
  // })
  // console.log('======= exportMusics ( index.vue ) =======\n', exportMusics)

  // if (newFiles.length !== files.length) {
  // console.log('已跳过', files.length - newFiles.length, '个重复文件')
  // }

  // 更新列表和播放列表(目前的设定只有本地列表允许导入, 所以只更新本地列表)
  // const musicList = [...userListStore.musicList, ...exportMusics]
  // userListStore.musicList = [...userListStore.musicList, ...exportMusics]
  // console.log('======= musicList ( index.vue ) =======\n', userListStore.musicList)

  try {
    // TODO: 将新音乐保存到数据库, 考虑一下是否跳过重复的文件
    // for (const music of exportMusics) {
    for (const music of files) {
      console.log('======= music ( index.vue ) =======\n', music)

      const song = {
        title: music.title,
        artist: music.artist,
        album: music.album,
        duration: music.duration,
        path: music.path,
        cover: music.cover,
      }
      await window.ipcRenderer.invoke('db:add-song', JSON.parse(JSON.stringify(song)))
      console.log('======= song ( index.vue ) =======\n', song)
    }

    // 更新菜单计数

    // 等待 nextTick 后刷新列表
    // await nextTick()
    console.log('======= userListStore.musicList ( index.vue ) =======\n', userListStore.musicList)
    await userListStore.getMusicList(LOCAL_UUID)
    console.log('======= userListStore.musicList ( index.vue ) =======\n', userListStore.musicList)
    menuStore.updateMenuCount(LOCAL_UUID, userListStore.musicList.length)
  }
  catch (error) {
    console.error('保存音乐到数据库失败:', error)
  }
}
</script>

<template>
  <div class="flex gap-6 p-6">
    <div class="h-[270px] w-[270px] overflow-hidden rounded-lg">
      <img
        v-if="activeMenuInfo.cover && !activeMenuInfo.cover.includes('i-carbon')"
        :src="`music://${activeMenuInfo.cover}`"
        :alt="activeMenuInfo.title"
        class="h-full w-full object-cover"
      >
      <div v-else class="h-full w-full bg-stone-200 p-10 dark:bg-stone-700">
        <div i-game-icons:sound-on class="h-full w-full" />
      </div>
    </div>
    <div class="flex flex-1 flex-col justify-between">
      <div />
      <div>
        <h1 class="mb-4 text-3xl font-bold">
          {{ activeMenuInfo.title }}
        </h1>
        <p class="text-sm text-stone-500 dark:text-stone-400">
          {{ activeMenuInfo.description }}
        </p>
      </div>
      <div class="flex gap-4">
        <Button
          variant="outline"
          size="sm"
          :disabled="isDisabled"
          @click="handlePlay"
        >
          <div i-carbon-play />
          播放
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="isDisabled"
          @click="handleRandomPlay"
        >
          <div i-carbon:shuffle />
          随机播放
        </Button>

        <ImportMusic v-if="showImport" @files="handleFilesUpdate" />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
