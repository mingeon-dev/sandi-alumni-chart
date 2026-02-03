<script setup>
import { computed, watch, ref, onMounted } from 'vue'
import { mdiAccountPlus, mdiOpenInNew } from '@mdi/js'
import { RouterView } from 'vue-router'
import { useRoute } from 'vue-router'
import { getTitle, loadData, dataState } from './util/DataHelper'

onMounted(() => {
  loadData()
})

const route = useRoute()

const FIRST_PATH = { title: '돌쇠 졸업생 현황', href: './', disabled: false }
const SECOND_PATH = { title: '전체', href: './list', disabled: false }

const routes = ref([FIRST_PATH])

const showInfo = computed(() => route.name === 'home' && !route.query?.title)

watch(route, () => {
  const { title, value, title2, value2 } = route.query
  if (route.name === 'home') {
    routes.value = [FIRST_PATH]
  }
  if (route.name === 'list') {
    routes.value = [FIRST_PATH, SECOND_PATH]
  }
  if (title && value) {
    routes.value = [
      FIRST_PATH,
      {
        title: `[${getTitle(title)}] ${value}`,
        href: `./?title=${title}&value=${value}`,
        disabled: false
      }
    ]
  }
  if (title2 && value2) {
    routes.value = [
      FIRST_PATH,
      {
        title: `[${getTitle(title)}] ${value}`,
        href: `./?title=${title}&value=${value}`,
        disabled: false
      },
      {
        title: title === title2 ? '전체' : `[${getTitle(title2)}] ${value2}`,
        href: `./list?title=${title}&value=${value}&title2=${title2}&value2=${value2}`,
        disabled: false
      }
    ]
  }
})

const openUrl = (url) => window.open(url)
</script>

<template>
  <div class="header">
    <v-breadcrumbs
      class="title"
      :class="{ 'without-info': !showInfo }"
      :items="routes"
    ></v-breadcrumbs>
    <p v-if="showInfo" class="header-info">업데이트: 2024년 9월 12일</p>
  </div>
  <div class="wrapper">
    <div v-if="dataState.isLoading" class="loading">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="loading-text">데이터를 불러오는 중...</p>
    </div>
    <div v-else-if="dataState.error" class="error">
      <p>데이터를 불러오는데 실패했습니다.</p>
      <p class="error-detail">{{ dataState.error }}</p>
    </div>
    <RouterView v-else />
  </div>
  <v-footer class="bg-primary">
    <v-row justify="center" no-gutters>
      <v-btn
        variant="text"
        :append-icon="mdiAccountPlus"
        @click="openUrl('http://pf.kakao.com/_xoEvxlG')"
        >멘토링 문의: 경희돌쇠 채널</v-btn
      >
      <v-btn
        variant="text"
        :append-icon="mdiOpenInNew"
        @click="openUrl('https://forms.gle/SniJArRjJegSDnP67')"
        >졸업생 정보 등록 구글폼</v-btn
      >
    </v-row>
  </v-footer>
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
  margin: 2rem 2rem 0 auto;
}

.wrapper {
  min-height: calc(100vh - 141.5px);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
}

.loading-text {
  margin-top: 1rem;
  color: #666;
}

.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  color: #d32f2f;
}

.error-detail {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #666;
}

@media only screen and (max-width: 600px) {
  .title {
    margin: 1rem 0 2rem 5px;
  }

  .without-info {
    width: 350px;
  }

  .header-info {
    margin: 1rem 5px 2rem auto;
  }

  .wrapper {
    min-height: auto;
  }
}
</style>
