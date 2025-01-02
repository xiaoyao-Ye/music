<script setup lang="ts">
import type { Playlist } from '@/stores/userList'
import CreateListDialog from '@/components/CreateListDialog.vue'
import { LOCAL_UUID } from '@/config/menus'
import { useMenuStore } from '@/stores/menu'
import { storeToRefs } from 'pinia'

const router = useRouter()
const route = useRoute('/list/[id]')

onMounted(() => {
  if (route.path === '/') {
    router.replace(`/list/${LOCAL_UUID}`)
  }
})

const menuStore = useMenuStore()
const { userMenus, activeMenu, defaultMenus } = storeToRefs(menuStore)

function toggleMenu(menuId: number) {
  // console.log('======= activeMenu.value ( index.vue ) =======\n', activeMenu.value === menuId)
  if (activeMenu.value === menuId)
    return

  router.push(`/list/${menuId}`)
  // console.log('======= menuId ( index.vue ) =======\n', menuId)
}

watchEffect(() => {
  // console.log('======= route.params.id ( index.vue ) =======\n', route.params.id)
  // TODO: 默认会触发一次, 这个时候 id 是 undefined
  if (route.params.id) {
    activeMenu.value = Number(route.params.id)
  }
})

const showDialog = ref(false)
async function handleCreateList(form: Omit<Playlist, 'id' | 'count'>) {
  console.log('======= form ( index.vue ) =======\n', form)
  const playlist = {
    title: form.title,
    description: form.description,
    cover: form.cover,
  }
  console.log('======= playlist ( index.vue ) =======\n', playlist)
  const id = await window.ipcRenderer.invoke('db:add-playlist', playlist)
  console.log('======= id ( index.vue ) =======\n', id)
  await menuStore.getUserMenus()
  router.push(`/list/${id}`)
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

      <ToggleGroup :model-value="activeMenu.toString()" type="single" class="flex-col">
        <ToggleGroupItem
          v-for="menu in defaultMenus"
          :key="menu.id"
          :value="menu.id.toString()"
          class="w-full justify-start gap-2"
          @click="toggleMenu(menu.id)"
        >
          <div :class="menu.cover" />
          <div>
            {{ menu.title }}
            <span class="text-stone-500">· {{ menu.count }}</span>
          </div>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>

    <!-- 自建歌单 -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <div class="flex items-center justify-between p-4 pb-2">
        <span class="text-sm text-stone-500">自建歌单</span>
        <Button
          variant="ghost"
          size="icon"
          class="icon-btn h-6 w-6"
          @click="showDialog = true"
        >
          <div i-carbon-add />
        </Button>
      </div>

      <div class="scrollbar flex-1 overflow-y-auto px-4">
        <ToggleGroup :model-value="activeMenu.toString()" type="single" class="flex-col">
          <ToggleGroupItem
            v-for="menu in userMenus"
            :key="menu.id"
            :value="menu.id.toString()"
            class="h-13 w-full justify-start gap-2 text-left"
            @click="toggleMenu(menu.id)"
          >
            <div class="h-9 w-9 overflow-hidden rounded-md bg-stone-200 dark:bg-stone-700">
              <img
                v-if="menu.cover"
                :src="`music://${menu.cover}`"
                :alt="menu.title"
                decoding="async"
                class="h-full w-full object-cover"
              >
            </div>
            <div class="flex-1 overflow-hidden">
              <div class="truncate">
                {{ menu.title }}
              </div>
              <div class="text-sm text-stone-500">
                {{ menu.count }} 首
              </div>
            </div>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>

    <CreateListDialog
      v-model="showDialog"
      @submit="handleCreateList"
    />
  </div>
</template>

<style scoped>
.scrollbar::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  border-radius: 5px;
}
.scrollbar::-webkit-scrollbar-thumb {
  border-radius: 5px;
}
</style>
