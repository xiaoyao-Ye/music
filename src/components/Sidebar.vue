<script setup lang="ts">
// 获取各个列表的数据
const favoritesList = useStorage<AudioMetadata[]>('favorites-list', [])
const recentList = useStorage<AudioMetadata[]>('recent-list', [])
const localList = useStorage<AudioMetadata[]>('music-list', [])

const menus = computed(() => [
  {
    icon: 'i-carbon-favorite',
    name: '喜欢',
    count: favoritesList.value.length,
    path: '/favorites',
  },
  {
    icon: 'i-carbon-recently-viewed',
    name: '最近播放',
    count: recentList.value.length,
    path: '/recent',
  },
  {
    icon: 'i-carbon-download',
    name: '本地和下载',
    count: localList.value.length,
    path: '/',
  },
])

// const customMenus = [
//   { icon: 'i-carbon-settings', name: '里外三公里', count: 888, router: '' },
//   { icon: 'i-carbon-settings', name: '安静', count: 888, router: '' },
//   { icon: 'i-carbon-settings', name: '电音/纯音乐', count: 888, router: '' },
// ]

const router = useRouter()
const route = useRoute()
const active = ref(route.path)

function handleMenuClick(path: string) {
  router.push(path)
}

const customPlaylists = useStorage<CustomPlaylist[]>('custom-playlists', [])

interface CustomPlaylist {
  id: string
  title: string
  description: string
  coverImage?: string
  count: number
}

const showDialog = ref(false)
function handleCreateList(form: CustomPlaylist) {
  const id = crypto.randomUUID()
  customPlaylists.value.push({
    ...form,
    id,
    count: 0,
  })
  useStorage(id, [])
}
</script>

<template>
  <!-- 左侧边栏 -->
  <div class="w-55 flex flex-col border-r border-stone-200 dark:border-stone-800">
    <!-- Logo -->
    <div class="flex items-center gap-2 p-4">
      <div i-game-icons:sound-on class="h-14 w-14" />
      <div class="pr-4 text-3xl font-bold">
        Music
      </div>
    </div>

    <!-- 用户信息 -->
    <div class="border-b border-stone-200 p-4 dark:border-stone-800">
      <div class="pb-1 text-sm text-stone-500">
        我的音乐
      </div>

      <ToggleGroup v-model="active" class="flex-col">
        <ToggleGroupItem
          v-for="menu in menus"
          :key="menu.name"
          :value="menu.path"
          class="w-full justify-start gap-2"
          @click="handleMenuClick(menu.path)"
        >
          <div :class="menu.icon" />
          <div>
            {{ menu.name }}
            <span class="text-stone-500">· {{ menu.count }}</span>
          </div>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>

    <!-- 自建歌单 -->
    <div class="flex-1 p-4">
      <div class="flex items-center justify-between pb-2">
        <span class="text-sm text-stone-500">自建歌单</span>
        <Button variant="ghost" size="icon" class="icon-btn h-6 w-6" @click="showDialog = true">
          <div i-carbon-add />
        </Button>
      </div>
      <ToggleGroup v-model="active" class="flex-col">
        <ToggleGroupItem
          v-for="playlist in customPlaylists"
          :key="playlist.id"
          :value="playlist.id"
          class="h-13 w-full justify-start gap-2 text-left"
          @click="router.push(`/custom/${playlist.id}`)"
        >
          <div class="h-9 w-9 overflow-hidden rounded-md bg-stone-200 dark:bg-stone-700">
            <img
              v-if="playlist.coverImage"
              :src="playlist.coverImage"
              :alt="playlist.title"
              class="h-full w-full object-cover"
            >
          </div>
          <div>
            <div>{{ playlist.title }}</div>
            <div class="text-sm text-stone-500">
              {{ playlist.count }} 首
            </div>
          </div>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>

    <CreateListDialog
      v-model="showDialog"
      @submit="handleCreateList"
    />
  </div>
</template>

<style scoped>

</style>
