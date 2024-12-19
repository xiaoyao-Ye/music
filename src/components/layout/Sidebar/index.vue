<script setup lang="ts">
import CreateListDialog from '@/components/CreateListDialog.vue'
import { MENU_INFO, USER_MENU_INFO } from '@/config'
import { LOCAL_UUID, SYSTEM_MENUS } from '@/config/menus'
import { randomUUID } from '@/lib'

const router = useRouter()
const route = useRoute('/list/[id]')
router.push('/')

const userMenus = useStorage<CustomPlaylist[]>(USER_MENU_INFO, [])
const menus = useStorage<CustomPlaylist[]>(MENU_INFO, SYSTEM_MENUS)

function handleMenuClick(menu: CustomPlaylist) {
  const url = menu.title === '本地和下载' ? '/' : `/list/${menu.id}`
  router.push(url)
}

const active = ref(LOCAL_UUID)
const showDialog = ref(false)
watchEffect(() => {
  active.value = route.path === '/' ? LOCAL_UUID : route.params.id
})
function handleCreateList(form: Omit<CustomPlaylist, 'id' | 'count'>) {
  const id = randomUUID()
  userMenus.value.push({ ...form, id, count: 0 })
  useStorage(id, [])
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

      <ToggleGroup v-model="active" type="single" class="flex-col">
        <ToggleGroupItem
          v-for="menu in menus"
          :key="menu.id"
          :value="menu.id"
          class="w-full justify-start gap-2"
          @click="handleMenuClick(menu)"
        >
          <div :class="menu.icon" />
          <div>
            {{ menu.title }}
            <span class="text-stone-500">· {{ menu.count }}</span>
          </div>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>

    <!-- 自建歌单 -->
    <div class="flex-1 p-4">
      <div class="flex items-center justify-between pb-2">
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

      <ToggleGroup v-model="active" type="single" class="flex-col">
        <ToggleGroupItem
          v-for="menu in userMenus"
          :key="menu.id"
          :value="menu.id"
          class="h-13 w-full justify-start gap-2 text-left"
          @click="handleMenuClick(menu)"
        >
          <div class="h-9 w-9 overflow-hidden rounded-md bg-stone-200 dark:bg-stone-700">
            <img
              v-if="menu.coverImage"
              :src="menu.coverImage"
              :alt="menu.title"
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

    <CreateListDialog
      v-model="showDialog"
      @submit="handleCreateList"
    />
  </div>
</template>
