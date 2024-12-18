<script setup lang="ts">
import { MENU_INFO, USER_MENU_INFO } from '@/config'

const props = defineProps<{
  music: AudioMetadata
  id: string
}>()

defineEmits(['play'])

const userMenus = useStorage<CustomPlaylist[]>(USER_MENU_INFO, [])

// 获取所有用户歌单
const allPlaylists = computed(() => {
  return userMenus.value.filter(playlist => playlist.id !== props.id)
})

// 添加到歌单
function handleAddToPlaylist(playlist: CustomPlaylist) {
  const list = useStorage<AudioMetadata[]>(playlist.id, [])
  // 检查是否已经存在
  if (!list.value.some(item => item.path === props.music.path)) {
    list.value.push(props.music)
    playlist.count = list.value.length
  }
}

// 从当前歌单删除
function handleDelete() {
  const list = useStorage<AudioMetadata[]>(props.id, [])
  const index = list.value.findIndex(item => item.path === props.music.path)
  if (index !== -1) {
    list.value.splice(index, 1)
    updateMenuCount(list.value.length)
  }
}

function updateMenuCount(count: number) {
  const isUserMenu = userMenus.value.some(item => item.id === props.id)
  const menus = useStorage<CustomPlaylist[]>(isUserMenu ? USER_MENU_INFO : MENU_INFO, [])
  menus.value.forEach((item) => {
    if (item.id === props.id)
      item.count = count
  })
}
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger>
      <slot />
    </ContextMenuTrigger>
    <ContextMenuContent class="w-40">
      <ContextMenuItem @click="$emit('play')">
        <div i-carbon:play class="mr-2" />
        播放
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuSub>
        <ContextMenuSubTrigger>
          <div i-carbon:add-alt class="mr-2" />
          添加到歌单
        </ContextMenuSubTrigger>
        <ContextMenuSubContent class="w-40">
          <div class="max-h-[200px] overflow-y-auto">
            <ContextMenuItem
              v-for="playlist in allPlaylists"
              :key="playlist.id"
              @click="handleAddToPlaylist(playlist)"
            >
              <div :class="playlist.icon || 'i-carbon:music'" class="mr-2" />
              <span class="truncate">{{ playlist.title }}</span>
            </ContextMenuItem>
          </div>
        </ContextMenuSubContent>
      </ContextMenuSub>
      <ContextMenuSeparator />
      <ContextMenuItem @click="handleDelete">
        <div i-carbon:trash-can class="mr-2" />
        从歌单中删除
      </ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
</template>
