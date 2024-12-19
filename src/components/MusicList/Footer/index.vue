<script setup lang="ts">
const props = defineProps<{
  musicList: AudioMetadata[]
}>()

// 计算总时长和歌曲数量
const totalInfo = computed(() => {
  const count = props.musicList.length
  const totalSeconds = props.musicList.reduce((sum, song) => sum + (song.duration || 0), 0)

  const totalDays = totalSeconds / (24 * 60 * 60)
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)

  let timeStr = ''
  if (totalDays >= 1) {
    timeStr = `${totalDays.toFixed(1)} 天`
  }
  else if (hours > 0) {
    timeStr = `${hours} 小时`
    if (minutes > 0)
      timeStr += ` ${minutes} 分钟`
  }
  else {
    timeStr = `${minutes} 分钟`
  }

  return `${count} 首歌曲，${timeStr}`
})
</script>

<template>
  <div class="p-4 text-sm text-stone-500">
    <span>{{ totalInfo }}</span>
  </div>
</template>

<style scoped>

</style>
