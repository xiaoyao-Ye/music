<script setup lang="ts">
const currentTime = ref('00:00')
const totalTime = ref('00:00')
const play = ref(false)
</script>

<template>
  <!-- 底部播放控制栏 -->
  <div class="h-20 flex items-center justify-between border-t border-stone-200 px-4 dark:border-stone-800">
    <div class="flex space-x-3">
      <div class="h-12 w-12 rounded-md bg-stone-200 dark:bg-stone-700" />
      <div>
        <span class="text-sm font-medium">
          都江堰
        </span>
      </div>
    </div>

    <div class="flex flex-col px-8">
      <div class="flex items-center justify-center">
        <Button variant="ghost">
          <div i-carbon:edt-loop />
        </Button>
        <Button variant="ghost">
          <div i-carbon:triangle-left-outline />
        </Button>
        <Button variant="ghost" size="lg" @click="play = !play">
          <div text-lg :class="play ? 'i-carbon-pause' : 'i-carbon-play-outline'" />
        </Button>
        <Button variant="ghost">
          <div i-carbon:triangle-right-outline />
        </Button>
        <Button variant="ghost">
          <div i-carbon:volume-up />
          <!-- <div i-carbon:volume-mute />
          <div i-carbon:volume-down />
          <div i-carbon:volume-down-alt />
          <div i-carbon:volume-up-alt /> -->
        </Button>
      </div>
      <div class="mt-2 flex items-center gap-3">
        <span class="text-xs text-stone-500">{{ currentTime }}</span>
        <div class="h-1 w-sm flex-1 rounded-full bg-stone-200 dark:bg-stone-700">
          <div class="h-full w-1/3 rounded-full bg-stone-500" />
        </div>
        <span class="text-xs text-stone-500">{{ totalTime }}</span>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <Button variant="ghost" size="icon">
        <div i-carbon-list />
      </Button>
    </div>
  </div>
</template>

<style scoped>

</style>
