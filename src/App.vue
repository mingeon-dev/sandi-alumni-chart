<script setup>
import { watch, ref } from 'vue'
import { RouterView } from 'vue-router'
import { useRoute } from 'vue-router'
import { getTitle } from './util/DataHelper'

const route = useRoute()

const FIRST_PATH = { title: '돌쇠 졸업생 현황', href: './', disabled: false }
const SECOND_PATH = { title: '전체', href: './list', disabled: false }

const routes = ref([])

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
  <v-breadcrumbs class="title" :items="routes"></v-breadcrumbs>
  <RouterView />
  <p class="footer-info">업데이트: 2024년 8월 21일</p>
</template>

<style scoped>
.title {
  margin: 2rem;
  padding: 0;
}

.footer-info {
  color: #9e9e9e;
  text-align: right;
  margin: 0 2rem 2rem;
}

@media only screen and (max-width: 600px) {
  .title {
    margin: 2rem auto;
  }

  .footer-info {
    margin: 0 5px 10px 0;
  }
}
</style>
