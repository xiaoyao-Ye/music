<script setup lang="ts">
import { usePlayerStore } from '@/stores/player'
import { formatDuration } from '@/utils/format'

const description = '"PV剧情"通常指的是与"PV"(Promotional Video，宣传视频) 相关的剧情内容，尤其在动漫、游戏等领域。它通常用于宣传作品，通过短片展示角色、情节、音乐等元素。'

// 使用 useStorage 替换手动的 localStorage 操作
const musicFiles = useStorage<AudioMetadata[]>('music-list', [])

const playerStore = usePlayerStore()

// 处理文件更新
function handleFilesUpdate(files: AudioMetadata[]) {
  // 过滤掉重复的文件
  const newFiles = files.filter((newFile) => {
    return !musicFiles.value.some(existingFile => existingFile.path === newFile.path)
  })

  // if (newFiles.length !== files.length) {
  // console.log('已跳过', files.length - newFiles.length, '个重复文件')
  // }

  // 更新列表和播放列表
  musicFiles.value = [...musicFiles.value, ...newFiles]
  playerStore.setPlaylist(musicFiles.value)
}

// 计算总时长和歌曲数量
const totalInfo = computed(() => {
  const count = musicFiles.value.length
  const totalSeconds = musicFiles.value.reduce((sum, song) => sum + (song.duration || 0), 0)
  const minutes = Math.floor(totalSeconds / 60)
  return `${count} 首歌曲，${minutes} 分钟`
})

// 初始化
onMounted(() => {
  playerStore.init()
  playerStore.setPlaylist(musicFiles.value)
})
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- 顶部封面和描述区域 -->
    <div class="flex gap-6 p-6">
      <div class="h-[270px] w-[270px] overflow-hidden rounded-lg">
        <img
          src="/image.jpeg"
          alt="Cover"
          class="h-full w-full object-cover"
        >
      </div>
      <div class="flex flex-1 flex-col justify-between">
        <div />
        <div>
          <h1 class="mb-4 text-3xl font-bold">
            Promotional Video
          </h1>
          <p class="text-sm text-stone-500 dark:text-stone-400">
            {{ description }}
          </p>
        </div>
        <div class="flex gap-4">
          <Button
            variant="outline"
            size="sm"
            :disabled="!musicFiles.length"
            @click="playerStore.playFromStart"
          >
            <div i-carbon-play />
            播放
          </Button>
          <Button
            variant="outline"
            size="sm"
            :disabled="!musicFiles.length"
            @click="playerStore.playRandom"
          >
            <div i-carbon:shuffle />
            随机播放
          </Button>

          <ImportMusic @files="handleFilesUpdate" />
        </div>
      </div>
    </div>

    <!-- 歌曲列表 -->
    <div class="flex-1 px-6">
      <!-- 列表头部 -->
      <div class="flex items-center gap-4 border-b border-stone-200 p-3 text-sm text-stone-500 font-medium dark:border-stone-800">
        <div class="flex-1">
          歌曲
        </div>
        <div class="w-25">
          艺人
        </div>
        <div class="lg:w-40 sm:w-30">
          专辑
        </div>
        <div class="w-15 text-right">
          时长
        </div>
      </div>

      <!-- 歌曲列表项 -->
      <div class="mt-2">
        <ToggleGroup type="single" class="flex-col">
          <ToggleGroupItem
            v-for="(music) in musicFiles"
            :key="music.path"
            :value="music.path"
            class="group h-auto w-full"
            :class="{ 'bg-stone-100 dark:bg-stone-800': music.path === playerStore.currentMusic?.path }"
            @dblclick="playerStore.playMusic(music)"
          >
            <div class="w-full flex items-center gap-4 rounded-md py-2 text-left text-sm">
              <div class="flex flex-1 items-center gap-3">
                <div
                  class="relative h-10 w-10 overflow-hidden rounded bg-stone-200 dark:bg-stone-700"
                >
                  <!-- 播放状态指示 -->
                  <div
                    class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100"
                    @click.stop="playerStore.playMusic(music)"
                  >
                    <div
                      class="z-1 cursor-pointer text-xl text-white"
                      :class="[
                        music.path === playerStore.currentMusic?.path && playerStore.isPlaying
                          ? 'i-carbon:pause'
                          : 'i-carbon:play',
                      ]"
                    />
                  </div>
                  <!-- 封面图片 -->
                  <img
                    v-if="music.cover"
                    :src="music.cover"
                    :alt="music.title"
                    class="h-full w-full object-cover"
                  >
                  <div v-else class="h-full w-full p-1">
                    <div i-game-icons:sound-on class="h-full w-full" />
                  </div>
                </div>
                <span class="truncate lg:max-w-xs sm:max-w-50">
                  {{ music.title }}
                </span>
              </div>
              <div class="w-25 text-stone-500">
                {{ music.artist }}
              </div>
              <div class="truncate text-stone-500 lg:w-40 sm:w-30">
                {{ music.album }}
              </div>
              <div class="w-15 text-right text-stone-500">
                {{ formatDuration(music.duration) }}
              </div>
            </div>
          </ToggleGroupItem>
        </ToggleGroup>
        <div v-if="musicFiles.length === 0" class="py-10 text-center text-sm text-stone-500">
          去导入一些音乐吧~
        </div>
      </div>
      <!-- 底部信息 -->
      <div class="p-4 text-sm text-stone-500">
        <span>{{ totalInfo }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.group:hover {
  @apply bg-stone-50 dark:bg-stone-900;
}
</style>
