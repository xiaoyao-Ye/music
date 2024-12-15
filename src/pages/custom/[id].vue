<script setup lang="ts">
import { usePlayerStore } from '@/stores/player'

const playerStore = usePlayerStore()

// 获取路由参数id
const route = useRoute('/custom/[id]')
const id = route.params.id
const customPlaylists = useStorage<CustomPlaylist[]>('custom-playlists', [])
const customPlaylist = customPlaylists.value.find(item => item.id === id)!
const musicList = useStorage<AudioMetadata[]>(id, [])
// TODO: 更新自定义歌单的歌曲数量
// customPlaylist.count = musicList.value.length

// 处理文件更新
function handleFilesUpdate(files: AudioMetadata[]) {
  // 过滤掉重复的文件
  const exportMusics = files.filter((file) => {
    return !musicList.value.some(({ path }) => path === file.path)
  })

  // if (newFiles.length !== files.length) {
  // console.log('已跳过', files.length - newFiles.length, '个重复文件')
  // }

  // 更新列表和播放列表
  musicList.value = [...musicList.value, ...exportMusics]
  playerStore.setPlaylist(musicList.value)
}

onMounted(() => {
  playerStore.setPlaylist(musicList.value)
})
</script>

<template>
  <MusicList
    :title="customPlaylist.title"
    :description="customPlaylist.description"
    :music-list="musicList"
  >
    <template #actions>
      <ImportMusic @files="handleFilesUpdate" />
    </template>
  </MusicList>
</template>
