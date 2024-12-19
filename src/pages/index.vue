<script setup lang="ts">
import { LOCAL_UUID } from '@/config/menus'

const id = LOCAL_UUID
</script>

<template>
  <MusicList
    :id="id"
    :show-import="true"
  />
</template>
