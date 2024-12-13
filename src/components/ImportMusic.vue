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

async function handleSelectDirectory() {
  try {
    const files = await window.ipcRenderer.invoke('select-directory')
    emit('files', files)
  }
  catch (error) {
    console.error('选择目录时出错:', error)
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
      @click="handleSelectDirectory"
    >
      <div i-carbon-folder />
      从文件夹导入
    </Button>
  </div>
</template>
