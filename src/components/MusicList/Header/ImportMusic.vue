<script setup lang="ts">
const emit = defineEmits<{
  files: [AudioMetadata[]]
}>()

// async function handleSelectFiles() {
//   try {
//     const files = await window.ipcRenderer.invoke('select-files')
//     emit('files', files)
//   }
//   catch (error) {
//     console.error('选择文件时出错:', error)
//   }
// }
const isImporting = ref(false)
async function handleSelectDirectory() {
  try {
    isImporting.value = true
    // console.log('选择目录')
    const files = await window.ipcRenderer.invoke('select-directory')
    console.log('======= files ( ImportMusic.vue ) =======\n', files)
    if (!files.length)
      return

    emit('files', files)
  }
  catch (error) {
    console.error('选择目录时出错:', error)
  }
  finally {
    isImporting.value = false
  }
}
</script>

<template>
  <div class="flex gap-2">
    <!-- <Button
      variant="outline"
      @click="handleSelectFiles"
    >
      <div i-carbon-music />
      导入音乐文件
    </Button> -->
    <Button
      variant="outline"
      size="sm"
      :disabled="isImporting"
      @click="handleSelectDirectory"
    >
      <div i-carbon-folder />
      {{ isImporting ? '导入中...' : '从文件夹导入' }}
    </Button>
  </div>
</template>
