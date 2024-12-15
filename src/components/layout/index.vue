<script setup lang="ts">
import Footer from './Footer/index.vue'
import Main from './Main/index.vue'
import Sidebar from './Sidebar/index.vue'
</script>

<template>
  <div class="h-screen flex flex-col">
    <div class="flex flex-1 overflow-hidden">
      <Sidebar />

      <Main />
    </div>

    <Footer />
  </div>
</template>
