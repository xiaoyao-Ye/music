<script setup lang="ts">
</script>

<template>
  <main class="flex flex-1 flex-col overflow-hidden dark:bg-stone-900">
    <!-- 设置区域 -->
    <div class="h-12 flex justify-end gap-2 px-4">
      <button icon-btn>
        <div i-carbon-settings />
      </button>

      <button icon-btn @click="toggleDark()">
        <div i-carbon-sun dark:i-carbon-moon />
      </button>
    </div>

    <div class="flex-1 overflow-hidden">
      <RouterView />
    </div>
  </main>
</template>

<style scoped>

</style>
