<script setup>
import { computed, ref } from 'vue'
import { mdiInformation } from '@mdi/js'
import PieChart from './chart/PieChart.vue'
import HorizontalBarChart from './chart/HorizontalBarChart.vue'
import SortingToggle from './SortingToggle.vue'
import { FIELD_NAME, getTitle, calcStatistics } from '@/util/DataHelper'
import { isMobile } from '@/util/MediaQuery'

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

const subjects = computed(() => calcStatistics(FIELD_NAME.SUBJECTS))

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
</script>

<template>
  <div class="info-area">
    <v-icon class="info-icon" color="#9E9E9E" :icon="mdiInformation"></v-icon>
    <span class="info-label">차트를 클릭하면 항목별 리스트를 볼 수 있어요.</span>
    <v-btn
      v-if="!isMobile"
      class="button"
      color="primary"
      density="compact"
      @click="$router.push('/list')"
      >전체 리스트 보기</v-btn
    >
  </div>
  <v-btn v-if="isMobile" class="button-mobile" elevation="4" @click="$router.push('/list')"
    >전체 리스트 보기</v-btn
  >
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
      <PieChart
        :field="FIELD_NAME.DEGREE"
        :data="calcStatistics(FIELD_NAME.DEGREE)"
        :unit="unitDegree"
      ></PieChart>
    </v-card>
    <v-card class="card" elevation="16">
      <template v-slot:title>
        <SortingToggle
          v-model="unitMaster"
          class="card-title-toggle"
          :title="getTitle(FIELD_NAME.MASTER_UNIVERSITY)"
          :values="pieUnits"
        ></SortingToggle>
      </template>
      <PieChart
        :field="FIELD_NAME.MASTER_UNIVERSITY"
        :data="calcStatistics(FIELD_NAME.MASTER_UNIVERSITY)"
        :unit="unitMaster"
      ></PieChart>
    </v-card>
    <v-card class="card" elevation="16">
      <template v-slot:title>
        <SortingToggle
          v-model="unitPhd"
          class="card-title-toggle"
          :title="getTitle(FIELD_NAME.PH_D_UNIVERSITY)"
          :values="pieUnits"
        ></SortingToggle>
      </template>
      <PieChart
        :field="FIELD_NAME.PH_D_UNIVERSITY"
        :data="calcStatistics(FIELD_NAME.PH_D_UNIVERSITY)"
        :unit="unitPhd"
      ></PieChart>
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
        :data="calcStatistics(FIELD_NAME.COMPANY_NAME)"
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
        :data="calcStatistics(FIELD_NAME.COMPANY_TASK_GROUP)"
        :sorting-value="sortingTaskGroup"
      ></HorizontalBarChart>
    </v-card>
    <v-card class="card bar" :title="getTitle(FIELD_NAME.YEAR_OF_ADMISSION)" elevation="16">
      <HorizontalBarChart
        :field="FIELD_NAME.YEAR_OF_ADMISSION"
        :data="calcStatistics(FIELD_NAME.YEAR_OF_ADMISSION)"
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
      <HorizontalBarChart
        :field="FIELD_NAME.SUBJECTS"
        :data="sortedSubjects"
        :aspect-ratio="0.2"
      ></HorizontalBarChart>
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
}

.info-icon {
  margin: 0 5px;
  vertical-align: bottom;
}

.info-label {
  color: #9e9e9e;
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
  max-width: 1320px;
  margin: 0 auto 20px;
}

.card {
  width: 400px;
  height: 496px;
  margin: 20px;
}

.bar {
  height: 716px;
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
}
</style>
