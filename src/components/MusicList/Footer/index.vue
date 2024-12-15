<script setup lang="ts">
const props = defineProps<{
  musicList: AudioMetadata[]
}>()

// 计算总时长和歌曲数量
const totalInfo = computed(() => {
  const count = props.musicList.length
  const totalSeconds = props.musicList.reduce((sum, song) => sum + (song.duration || 0), 0)
  const minutes = Math.floor(totalSeconds / 60)
  return `${count} 首歌曲，${minutes} 分钟`
})
</script>

<template>
  <div class="p-4 text-sm text-stone-500">
    <span>{{ totalInfo }}</span>
  </div>
</template>

<style scoped>

</style>
