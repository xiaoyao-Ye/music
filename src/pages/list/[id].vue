<script setup lang="ts">
// 获取路由参数id
const route = useRoute('/list/[id]')
// TODO: 更新自定义歌单的歌曲数量
// customPlaylist.count = musicList.value.length
</script>

<template>
  <MusicList
    :id="route.params.id"
  />
</template>
