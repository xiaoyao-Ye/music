<script setup lang="ts">
interface Song {
  name: string
  artist: string
  album: string
  duration: string
  cover?: string
}

const playList: Song[] = [
  {
    name: '秋水伊人（韩非与赢政）',
    artist: '魏小涵',
    album: '天行九歌 原声音乐',
    duration: '2:15',
    cover: '/image.jpeg',
  },
  {
    name: '【全职高手同人】[叶修×苏沐秋]《落差——记苏沐秋》(pv剧情) (Cover...)',
    artist: '殇小天',
    album: '【全职高手同人】[叶修×苏沐秋]《落差——记苏沐秋》',
    duration: '3:44',
    cover: '/image.jpeg',
  },
  {
    name: '十殿阎罗',
    artist: '未知',
    album: '',
    duration: '2:18',
  },
  {
    name: '我告诉你什么事最可恶 (Jones & Brock&RTRemix)',
    artist: 'RT',
    album: '大鱼海棠 &精鲲淑',
    duration: '4:02',
    cover: '/image.jpeg',
  },
  {
    name: '秋水伊人（韩非与赢政）',
    artist: '魏小涵',
    album: '天行九歌 原声音乐',
    duration: '2:15',
    cover: '/image.jpeg',
  },
  {
    name: '【全职高手同人】[叶修×苏沐秋]《落差——记苏沐秋》(pv剧情) (Cover...)',
    artist: '殇小天',
    album: '【全职高手同人】[叶修×苏沐秋]《落差——记苏沐秋》',
    duration: '3:44',
    cover: '/image.jpeg',
  },
  {
    name: '十殿阎罗',
    artist: '未知',
    album: '',
    duration: '2:18',
  },
  {
    name: '我告诉你什么事最可恶 (Jones & Brock&RTRemix)',
    artist: 'RT',
    album: '大鱼海棠 &精鲲淑',
    duration: '4:02',
    cover: '/image.jpeg',
  },
]

const description = '"PV剧情"通常指的是与"PV"(Promotional Video，宣传视频) 相关的剧情内容，尤其在动漫、游戏等领域。它通常用于宣传作品，通过短片展示角色、情节、音乐等元素。'
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
          <Button variant="outline">
            <div i-carbon-play />
            播放
          </Button>
          <Button variant="outline">
            <div i-carbon-shuffle />
            随机播放
          </Button>
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
        <div class="w-30">
          艺人
        </div>
        <div class="w-50">
          专辑
        </div>
        <div class="w-30 text-right">
          时长
        </div>
      </div>

      <!-- 歌曲列表项 -->
      <div class="mt-2">
        <ToggleGroup type="single" class="flex-col">
          <ToggleGroupItem
            v-for="(song) in playList"
            :key="song.name"
            :value="song.name"
            class="h-auto w-full"
          >
            <div class="w-full flex items-center gap-4 rounded-md py-2 text-left text-sm">
              <div class="flex-1">
                <div class="flex items-center gap-3">
                  <div
                    class="h-10 w-10 overflow-hidden rounded bg-stone-200 dark:bg-stone-700"
                  >
                    <img
                      v-if="song.cover"
                      :src="song.cover"
                      :alt="song.name"
                      class="h-full w-full object-cover"
                    >
                    <div v-else class="h-full w-full p-1">
                      <div i-game-icons:sound-on class="h-full w-full" />
                    </div>
                  </div>
                  <span class="flex-1 truncate">{{ song.name }}</span>
                </div>
              </div>
              <div class="w-30 text-stone-500">
                {{ song.artist }}
              </div>
              <div class="w-50 truncate text-stone-500">
                {{ song.album }}
              </div>
              <div class="w-30 text-right text-stone-500">
                {{ song.duration }}
              </div>
            </div>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <!-- 底部信息 -->
      <div class="p-4 text-sm text-stone-500">
        <span>4 首歌曲，12 分钟</span>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
