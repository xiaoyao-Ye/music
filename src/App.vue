<script setup lang="ts">
// defineOptions({
//   name: 'ClientPage',
// })
</script>

<template>
  <div class="h-screen flex flex-col">
    <div class="flex flex-1 overflow-hidden">
      <Sidebar />

      <!-- 主内容区 -->
      <main class="flex flex-1 flex-col dark:bg-stone-900">
        <!-- 设置区域 -->
        <div class="h-12 flex justify-end gap-2 px-4">
          <button icon-btn>
            <div i-carbon-settings />
          </button>

          <button icon-btn @click="toggleDark()">
            <div i-carbon-sun dark:i-carbon-moon />
          </button>
        </div>

        <div class="flex-1 overflow-y-scroll">
          <RouterView />
        </div>
      </main>
    </div>

    <Footer />
  </div>
</template>
