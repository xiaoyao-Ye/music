<script setup lang="ts">
const data = defineModel<string>()

// const imagePreview = ref<string | null>(null)

function handleImageUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  // console.log('======= file ( Upload.vue ) =======\n', file)
  if (file) {
    // imagePreview.value = URL.createObjectURL(file)
    data.value = URL.createObjectURL(file)
    // const reader = new FileReader()
    // reader.onload = (e) => {
    //   if (typeof e.target?.result === 'string') {
    //     const xx = e.target.result
    //     console.log('======= xx ( Upload.vue ) =======\n', xx)
    //   }
    // }
    // reader.readAsDataURL(file)
  }
}
</script>

<template>
  <div
    class="h-40 w-40 overflow-hidden rounded-md bg-stone-100 dark:bg-stone-800"
    role="button"
    @click="$refs.fileInput.click()"
  >
    <img
      v-if="data"
      :src="data"
      class="h-full w-full object-cover"
    >
    <div
      v-else
      class="h-full w-full flex items-center justify-center"
    >
      <div i-carbon:add class="h-10 w-10 text-stone-400" />
    </div>
    <input
      ref="fileInput"
      class="hidden"
      type="file"
      accept="image/*"
      @change="handleImageUpload"
    >
  </div>
</template>

<style scoped>

</style>
