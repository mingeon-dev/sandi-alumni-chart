<script setup>
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { useRoute } from 'vue-router'
import { getTitle } from './util/DataHelper'

const route = useRoute()

const breadcrumb2 = computed(() => {
  if (route.path === '/list') {
    const [key, value] = Object.entries(route.query)?.[0] ?? []
    return key
      ? [{ title: `[${getTitle(key)}] ${value}`, href: `./list?${key}=${value}`, disabled: false }]
      : [{ title: '전체', href: './list', disabled: false }]
  } else {
    return []
  }
})

const routes = computed(() => {
  return [
    {
      title: '돌쇠 졸업생 현황',
      href: './',
      disabled: false
    },
    ...breadcrumb2.value
  ]
})
</script>

<template>
  <v-breadcrumbs class="title" :items="routes"></v-breadcrumbs>
  <RouterView />
</template>

<style scoped>
.title {
  margin: 2rem;
  padding: 0;
}
</style>
