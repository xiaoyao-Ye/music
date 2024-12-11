<script setup lang="ts" generic="T extends any, O extends any">
defineOptions({
  name: 'IndexPage',
})

const name = ref('')

const router = useRouter()
function go() {
  if (name.value)
    router.push(`/hi/${encodeURIComponent(name.value)}`)
}
</script>

<template>
  <div>
    <div i-carbon-campsite inline-block text-4xl />
    <p>
      <a rel="noreferrer" href="https://github.com/xiaoyao-Ye/template" target="_blank">
        Vitesse Lite + Electron + Shadcn-vue
      </a>
    </p>
    <p>
      <em text-sm op75>Opinionated Starter Template</em>
    </p>

    <div py-4 />

    <TheInput
      v-model="name"
      placeholder="What's your name?"
      autocomplete="false"
      @keydown.enter="go"
    />

    <div>
      <Button
        size="sm"
        class="m-3 text-sm"
        :disabled="!name"
        @click="go"
      >
        Go
      </Button>
    </div>
  </div>
</template>
