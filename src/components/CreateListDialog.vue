<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [form: FormData]
}>()

const data = useVModel(props, 'modelValue', emit)

interface FormData {
  title: string
  description: string
  coverImage: string
}
const form = reactive<FormData>({
  title: '',
  description: '',
  coverImage: '',
})

// const imagePreview = ref<string>()
// 处理取消
// function handleCancel() {
//   data.value = false
//   // 重置表单
//   form.title = ''
//   form.description = ''
//   form.coverImage = ''
//   // imagePreview.value = undefined
// }

function handleCreate() {
  form.title = form.title.trim() ? form.title : '未命名歌单'
  // console.log('======= form ( CreatePlaylistDialog.vue ) =======\n', form)
  emit('submit', form)
}
</script>

<template>
  <Dialog v-model:open="data">
    <DialogContent class="sm:max-w-sm">
      <DialogHeader>
        <DialogTitle class="text-center">
          新建播放列表
        </DialogTitle>
        <DialogDescription>
          <!-- 创建一个播放列表，并添加歌曲 -->
        </DialogDescription>
      </DialogHeader>

      <div class="flex flex-col items-center gap-4 py-4">
        <UploadImage v-model="form.coverImage" />

        <Input
          v-model="form.title"
          placeholder="请输入歌单标题"
        />

        <Textarea
          v-model="form.description"
          placeholder="请输入歌单描述"
        />
      </div>
      <div class="flex justify-between">
        <DialogClose as-child>
          <Button variant="outline">
            取消
          </Button>
        </DialogClose>
        <Button @click="handleCreate">
          创建
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
