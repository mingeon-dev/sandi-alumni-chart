<script setup>
import { computed, watch, ref } from 'vue'
import { RouterView } from 'vue-router'
import { useRoute } from 'vue-router'
import { getTitle } from './util/DataHelper'

const route = useRoute()

const FIRST_PATH = { title: '돌쇠 졸업생 현황', href: './', disabled: false }
const SECOND_PATH = { title: '전체', href: './list', disabled: false }

const routes = ref([])

const showInfo = computed(() => route.name === 'home')

watch(route, () => {
  const { title, value, id } = route.query
  routes.value = [
    FIRST_PATH,
    ...(title && value
      ? [
          {
            title: `[${getTitle(title)}] ${value}`,
            href: `./list?title=${title}&value=${value}`,
            disabled: false
          }
        ]
      : route.name !== 'home'
        ? [SECOND_PATH]
        : []),
    ...(id ? ['?'] : [])
  ]
})
</script>

<template>
  <div class="header">
    <v-breadcrumbs class="title" :items="routes"></v-breadcrumbs>
    <p v-if="showInfo" class="header-info">업데이트: 2024년 8월 27일</p>
  </div>
  <RouterView />
</template>

<style scoped>
.header {
  display: flex;
}

.title {
  flex: none;
  margin: 2rem 2rem 0;
  padding: 0;
}

.header-info {
  font-size: 14px;
  color: #9e9e9e;
  text-align: right;
  /* margin: 1rem 1rem 0; */
  margin: 2rem 2rem 0 auto;
}

@media only screen and (max-width: 600px) {
  .title {
    margin: 1rem 0 2rem 5px;
  }

  .header-info {
    margin: 1rem 5px 2rem auto;
  }
}
</style>
