<script setup lang="ts">
const data = defineModel<string>()

async function getImagePath() {
  const path = await window.ipcRenderer.invoke('select-image')
  if (path) {
    data.value = path
  }
}
</script>

<template>
  <div
    class="h-40 w-40 overflow-hidden rounded-md bg-stone-100 dark:bg-stone-800"
    role="button"
    @click="getImagePath"
  >
    <img
      v-if="data"
      :src="`music://${data}`"
      class="h-full w-full object-cover"
    >
    <div
      v-else
      class="h-full w-full flex items-center justify-center"
    >
      <div i-carbon:add class="h-10 w-10 text-stone-400" />
    </div>
  </div>
</template>

<style scoped>

</style>
