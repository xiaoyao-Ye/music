<script setup lang="ts">
import type { Playlist } from '@/stores/userList'
import CreateListDialog from '@/components/CreateListDialog.vue'
import { useMenuStore } from '@/stores/menu'
import { useUserListStore } from '@/stores/userList'

const props = defineProps<{
  music: AudioMetadata
}>()

const emit = defineEmits<{
  play: []
  playNext: []
}>()

const userListStore = useUserListStore()
const menuStore = useMenuStore()

// 获取所有其他歌单
const allPlaylists = computed(() => {
  return menuStore.userMenus.filter(playlist => playlist.id !== menuStore.activeMenu)
})

// 添加到歌单
async function handleAddToPlaylist(playlistId: number, isNewList: boolean = false) {
  const songId = props.music.id
  const count = await window.ipcRenderer.invoke('db:add-song-to-playlist', playlistId, songId)
  if (isNewList) {
    await menuStore.getUserMenus()
  }
  else {
    count !== 0 && menuStore.updateMenuCount(playlistId, count)
  }
}

// 从当前歌单删除
async function handleDelete() {
  userListStore.deleteMusic(props.music)
}

// 创建新歌单并添加当前音乐
const router = useRouter()
const showDialog = ref(false)
async function handleCreateList(form: Omit<Playlist, 'id' | 'count'>) {
  const playlist = {
    title: form.title,
    description: form.description,
    cover: form.cover,
  }
  const id = await window.ipcRenderer.invoke('db:add-playlist', playlist)
  await handleAddToPlaylist(id, true)
  router.push(`/list/${id}`)
}
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger as="div">
      <slot />
    </ContextMenuTrigger>
    <ContextMenuContent class="w-40">
      <ContextMenuItem @click="$emit('play')">
        <div i-carbon:play class="mr-2" />
        播放
      </ContextMenuItem>
      <ContextMenuItem @click="emit('playNext')">
        <div i-carbon:play-filled-alt class="mr-2" />
        下一首播放
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuSub>
        <ContextMenuSubTrigger>
          <div i-carbon:add-alt class="mr-2" />
          添加到歌单
        </ContextMenuSubTrigger>
        <ContextMenuSubContent class="w-40">
          <div class="max-h-[200px] overflow-x-hidden overflow-y-auto">
            <ContextMenuItem @click="showDialog = true">
              <div i-carbon:add class="mr-2" />
              <span class="truncate">新建列表</span>
            </ContextMenuItem>
            <ContextMenuSeparator v-if="allPlaylists.length" />
            <ContextMenuItem
              v-for="playlist in allPlaylists"
              :key="playlist.id"
              @click="handleAddToPlaylist(playlist.id)"
            >
              <div i-carbon:music class="mr-2" />
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

  <CreateListDialog
    v-model="showDialog"
    @submit="handleCreateList"
  />
</template>
