<script setup lang="ts">
const props = defineProps<{
  volume: number[]
  muted: boolean
}>()

const emit = defineEmits<{
  'update:volume': [value: number[]]
  'toggleMute': []
}>()

const volume = useVModel(props, 'volume', emit)
</script>

<template>
  <div class="w-1/4 flex items-center justify-between gap-2">
    <div class="flex items-center gap-2">
      <div
        class="cursor-pointer"
        :class="[muted ? 'i-carbon:volume-mute' : 'i-carbon:volume-up']"
        @click="emit('toggleMute')"
      />
      <div class="slider w-25">
        <Slider
          v-model="volume"
          :max="100"
          :step="1"
        />
      </div>
    </div>

    <Button variant="ghost" size="icon">
      <div i-carbon-list />
    </Button>
  </div>
</template>

<style scoped>
:deep(.slider) * {
  outline: none;
  box-shadow: none;
}
</style>
