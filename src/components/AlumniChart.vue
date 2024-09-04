<script setup>
import { computed, ref } from 'vue'
import { mdiInformation } from '@mdi/js'
import PieChart from './chart/PieChart.vue'
import HorizontalBarChart from './chart/HorizontalBarChart.vue'
import SortingToggle from './SortingToggle.vue'
import {
  FIELD_NAME,
  getTitle,
  calcStatistics,
  getDataByFilter,
  getTotalDataLength
} from '@/util/DataHelper'
import { isMobile } from '@/util/MediaQuery'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'

const route = useRoute()
const router = useRouter()

const pieUnits = ref([
  { value: 'percent', text: '%' },
  { value: 'value', text: '명' }
])
const unitDegree = ref('percent')
const unitMaster = ref('percent')
const unitPhd = ref('percent')
const barSortingValues = ref([
  { value: 'label', text: '이름순' },
  { value: 'data', text: '인원순' }
])
const sortingCompanyName = ref('label')
const sortingTaskGroup = ref('label')
const sortingSubjects = ref('label')

const title = computed(() =>
  route.query.title
    ? '차트의 개별 항목을 클릭하면 리스트 페이지를 보여줘요.'
    : '차트의 개별 항목을 클릭하면 해당 항목의 리스트로 차트 페이지를 다시 보여줘요.'
)

const currentDataLength = computed(() => dataByRoute.value?.length ?? getTotalDataLength())

const textAll = computed(() => `전체 리스트 보기 (${currentDataLength.value})`)

const dataByRoute = computed(() => {
  const { title, value } = route.query
  return title && value ? getDataByFilter(title, value) : null
})

const degree = computed(() => calcStatistics(FIELD_NAME.DEGREE, dataByRoute.value))

const masterUniversity = computed(() =>
  calcStatistics(FIELD_NAME.MASTER_UNIVERSITY, dataByRoute.value)
)

const hasMasterUniversity = computed(() => Object.keys(masterUniversity.value).length > 0)

const phDUniversity = computed(() => calcStatistics(FIELD_NAME.PH_D_UNIVERSITY, dataByRoute.value))

const hasPhDUniversity = computed(() => Object.keys(phDUniversity.value).length > 0)

const subjects = computed(() => calcStatistics(FIELD_NAME.SUBJECTS, dataByRoute.value))

const sortedSubjects = computed(() =>
  Object.entries(subjects.value)
    .sort(([label1, data1], [label2, data2]) => {
      if (sortingSubjects.value === 'label') {
        return label1 > label2 ? 1 : -1
      } else {
        return data2 - data1
      }
    })
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {})
)

const subjectData = computed(() => {
  if (Object.keys(sortedSubjects.value).length === 0) return [{}, {}, {}]
  const DIVISOR = 3
  const length = Math.floor(Object.keys(sortedSubjects.value).length / DIVISOR)
  let index = 0
  return Object.entries(sortedSubjects.value).reduce((r, [k, v]) => {
    if (!r[index]) r[index] = {}
    r[index][k] = v
    if (Object.keys(r[index]).length >= length && index !== DIVISOR - 1) index++
    return r
  }, [])
})

const maxScale = computed(() => Math.ceil(Math.max(...Object.values(subjects.value)) / 10) * 10)

onBeforeRouteUpdate((to) => {
  const { title, value } = to.query
  const data = getDataByFilter(title, value)
  if (data.length === 1) {
    return { path: '/detail', query: { ...to.query, id: data[0].id } }
  }
})

const routeList = () => {
  router.push({ path: '/list', query: route.query })
}
</script>

<template>
  <div class="info-area">
    <div class="info-wrapper">
      <v-icon class="info-icon" color="#9E9E9E" :icon="mdiInformation"></v-icon>
      <span class="info-label">{{ title }}</span>
    </div>
    <v-btn v-if="!isMobile" class="button" color="primary" density="compact" @click="routeList">{{
      textAll
    }}</v-btn>
  </div>
  <v-btn v-if="isMobile" class="button-mobile" elevation="4" @click="routeList">{{
    textAll
  }}</v-btn>
  <div class="container">
    <v-card class="card" elevation="16">
      <template v-slot:title>
        <SortingToggle
          v-model="unitDegree"
          class="card-title-toggle"
          :title="getTitle(FIELD_NAME.DEGREE)"
          :values="pieUnits"
        ></SortingToggle>
      </template>
      <PieChart :field="FIELD_NAME.DEGREE" :data="degree" :unit="unitDegree"></PieChart>
    </v-card>
    <v-card class="card" elevation="16">
      <template v-slot:title>
        <SortingToggle
          v-model="unitMaster"
          class="card-title-toggle"
          :title="getTitle(FIELD_NAME.MASTER_UNIVERSITY)"
          :values="pieUnits"
          :hide="!hasMasterUniversity"
        ></SortingToggle>
      </template>
      <PieChart
        v-if="hasMasterUniversity"
        :field="FIELD_NAME.MASTER_UNIVERSITY"
        :data="masterUniversity"
        :unit="unitMaster"
      ></PieChart>
      <div class="empty" v-else>데이터가 없어요</div>
    </v-card>
    <v-card class="card" elevation="16">
      <template v-slot:title>
        <SortingToggle
          v-model="unitPhd"
          class="card-title-toggle"
          :title="getTitle(FIELD_NAME.PH_D_UNIVERSITY)"
          :values="pieUnits"
          :hide="!hasPhDUniversity"
        ></SortingToggle>
      </template>
      <PieChart
        v-if="hasPhDUniversity"
        :field="FIELD_NAME.PH_D_UNIVERSITY"
        :data="phDUniversity"
        :unit="unitPhd"
      ></PieChart>
      <div class="empty" v-else>데이터가 없어요</div>
    </v-card>
    <v-card class="card bar" elevation="16">
      <template v-slot:title>
        <SortingToggle
          v-model="sortingCompanyName"
          class="card-title-toggle"
          :title="getTitle(FIELD_NAME.COMPANY_NAME)"
          :values="barSortingValues"
        ></SortingToggle>
      </template>
      <HorizontalBarChart
        :field="FIELD_NAME.COMPANY_NAME"
        :data="calcStatistics(FIELD_NAME.COMPANY_NAME, dataByRoute)"
        :sorting-value="sortingCompanyName"
      ></HorizontalBarChart>
    </v-card>
    <v-card class="card bar" elevation="16">
      <template v-slot:title>
        <SortingToggle
          v-model="sortingTaskGroup"
          class="card-title-toggle"
          :title="getTitle(FIELD_NAME.COMPANY_TASK_GROUP)"
          :values="barSortingValues"
        ></SortingToggle>
      </template>
      <HorizontalBarChart
        :field="FIELD_NAME.COMPANY_TASK_GROUP"
        :data="calcStatistics(FIELD_NAME.COMPANY_TASK_GROUP, dataByRoute)"
        :sorting-value="sortingTaskGroup"
      ></HorizontalBarChart>
    </v-card>
    <v-card class="card bar" :title="getTitle(FIELD_NAME.YEAR_OF_ADMISSION)" elevation="16">
      <HorizontalBarChart
        :field="FIELD_NAME.YEAR_OF_ADMISSION"
        :data="calcStatistics(FIELD_NAME.YEAR_OF_ADMISSION, dataByRoute)"
      ></HorizontalBarChart>
    </v-card>
    <v-card v-if="isMobile" class="card bar" elevation="16">
      <template v-slot:title>
        <SortingToggle
          v-model="sortingSubjects"
          class="card-title-toggle"
          :title="getTitle(FIELD_NAME.SUBJECTS)"
          :values="barSortingValues"
        ></SortingToggle>
      </template>
      <HorizontalBarChart :field="FIELD_NAME.SUBJECTS" :data="sortedSubjects"></HorizontalBarChart>
    </v-card>
    <template v-else>
      <v-card class="card bar" elevation="16">
        <template v-slot:title>
          <SortingToggle
            v-model="sortingSubjects"
            class="card-title-toggle"
            :title="`${getTitle(FIELD_NAME.SUBJECTS)} (1)`"
            :values="barSortingValues"
          ></SortingToggle>
        </template>
        <HorizontalBarChart
          :field="FIELD_NAME.SUBJECTS"
          :data="subjectData[0]"
          :max-scale="maxScale"
        ></HorizontalBarChart>
      </v-card>
      <v-card class="card bar" :title="`${getTitle(FIELD_NAME.SUBJECTS)} (2)`" elevation="16">
        <HorizontalBarChart
          :field="FIELD_NAME.SUBJECTS"
          :data="subjectData[1]"
          :max-scale="maxScale"
        ></HorizontalBarChart>
      </v-card>
      <v-card class="card bar" :title="`${getTitle(FIELD_NAME.SUBJECTS)} (3)`" elevation="16">
        <HorizontalBarChart
          :field="FIELD_NAME.SUBJECTS"
          :data="subjectData[2]"
          :max-scale="maxScale"
        ></HorizontalBarChart>
      </v-card>
    </template>
  </div>
</template>

<style scoped>
.info-area {
  margin: 2rem;
  display: flex;
}

.info-wrapper {
  display: table;
  margin: 0 5px;
}

.info-icon {
  display: table-cell;
  vertical-align: top;
}

.info-label {
  color: #9e9e9e;
  display: table-cell;
  vertical-align: top;
  padding-left: 5px;
}

.button {
  margin: 0 20px;
  vertical-align: text-bottom;
}

.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: space-around;
  align-items: center;
  max-width: 1130px;
  margin: 0 auto 20px;
}

.card {
  width: 340px;
  height: 396px;
  margin: 10px;
}

.bar {
  height: 618px;
}

.empty {
  height: 444px;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media only screen and (max-width: 600px) {
  .info-area {
    margin: 0 auto 2rem;
  }

  .button-mobile {
    display: block;
    width: 350px;
    margin: 0 auto 2rem;
  }

  .container {
    margin: 0;
  }

  .card {
    width: 350px;
    height: auto;
    margin: 0 auto 2rem;
  }

  .empty {
    height: 100px;
  }
}
</style>
