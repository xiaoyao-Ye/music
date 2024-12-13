<script setup lang="ts">
const menus = [
  { icon: 'i-carbon-settings', name: '喜欢', count: 888, router: '' },
  { icon: 'i-carbon-settings', name: '最近播放', count: 888, router: '' },
  { icon: 'i-carbon-settings', name: '本地和下载', count: 888, router: '' },
]
const customMenus = [
  { icon: 'i-carbon-settings', name: '里外三公里', count: 888, router: '' },
  { icon: 'i-carbon-settings', name: '安静', count: 888, router: '' },
  { icon: 'i-carbon-settings', name: '电音/纯音乐', count: 888, router: '' },
]
const active = ref(menus[0].name)
</script>

<template>
  <!-- 左侧边栏 -->
  <div class="w-60 flex flex-col border-r border-stone-200 dark:border-stone-800">
    <!-- Logo -->
    <div class="flex items-center gap-2 p-4">
      <div i-game-icons:sound-on class="h-14 w-14" />
      <div class="text-3xl font-bold">
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
          :value="menu.name"
          class="w-full justify-start gap-2"
          @click="active = menu.name"
        >
          <div :class="menu.icon" />
          <div>
            {{ `${menu.name}·${menu.count}` }}
          </div>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>

    <!-- 自建歌单 -->
    <div class="flex-1 p-4">
      <div class="flex items-center justify-between pb-2">
        <span class="text-sm text-stone-500">自建歌单</span>
        <Button variant="ghost" size="icon" class="icon-btn h-6 w-6">
          <div i-carbon-add />
        </Button>
      </div>
      <ToggleGroup v-model="active" class="flex-col">
        <ToggleGroupItem
          v-for="menu in customMenus"
          :key="menu.name"
          :value="menu.name"
          class="h-13 w-full justify-start gap-2 text-left"
          @click="active = menu.name"
        >
          <div class="h-9 w-9 rounded-md bg-stone-200 dark:bg-stone-700" />
          <div>
            <div>
              {{ menu.name }}
            </div>
            <div>
              {{ menu.count }} 首
            </div>
          </div>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  </div>
</template>

<style scoped>

</style>
