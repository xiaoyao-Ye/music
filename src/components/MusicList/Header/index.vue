<script setup lang="ts">
import { LOCAL_UUID, MENU_INFO } from '@/config'
import { usePlayerStore } from '@/stores/player'
import { computed } from 'vue'
import ImportMusic from './ImportMusic.vue'

const props = withDefaults(defineProps<Props>(), {
  showImport: false,
})

interface Props {
  showImport?: boolean
  info: {
    title: string
    description: string
    coverImage?: string
  }
  musicList: AudioMetadata[]
}
const playerStore = usePlayerStore()

// 是否禁用播放按钮
const isDisabled = computed(() => !props.musicList.length)

// 播放功能
function handlePlay() {
  playerStore.setPlaylist(props.musicList)
  playerStore.playFromStart()
}

// 随机播放功能
function handleRandomPlay() {
  playerStore.setPlaylist(props.musicList)
  playerStore.playRandom()
}

// 处理文件更新
function handleFilesUpdate(files: AudioMetadata[]) {
  // 过滤掉重复的文件
  const exportMusics = files.filter((file) => {
    return !props.musicList.some(({ path }) => path === file.path)
  })

  // if (newFiles.length !== files.length) {
  // console.log('已跳过', files.length - newFiles.length, '个重复文件')
  // }

  // 更新列表和播放列表(目前的设定只有本地列表允许导入, 所以只更新本地列表)
  const musicList = [...props.musicList, ...exportMusics]
  const localList = useStorage<AudioMetadata[]>(LOCAL_UUID, [])
  localList.value = musicList
  const menu = useStorage<CustomPlaylist[]>(MENU_INFO, [])
  menu.value.find(item => item.id === LOCAL_UUID)!.count = musicList.length
}
</script>

<template>
  <div class="flex gap-6 p-6">
    <div class="h-[270px] w-[270px] overflow-hidden rounded-lg">
      <img
        :src="info.coverImage || '/image.jpeg'"
        :alt="info.title"
        class="h-full w-full object-cover"
      >
    </div>
    <div class="flex flex-1 flex-col justify-between">
      <div />
      <div>
        <h1 class="mb-4 text-3xl font-bold">
          {{ info.title }}
        </h1>
        <p class="text-sm text-stone-500 dark:text-stone-400">
          {{ info.description }}
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
