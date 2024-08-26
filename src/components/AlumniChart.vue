<script setup>
import { ref } from 'vue'
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
const unitMajor = ref('percent')
const unitMaster = ref('percent')
const unitPhd = ref('percent')
const barSortingValues = ref([
  { value: 'label', text: '이름순' },
  { value: 'data', text: '인원순' }
])
const sortingCompanyName = ref('label')
const sortingTaskGroup = ref('label')
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
    <v-card class="card" :title="getTitle(FIELD_NAME.MAJOR)" elevation="16">
      <template v-slot:title>
        <SortingToggle
          v-model="unitMajor"
          class="card-title-toggle"
          :title="getTitle(FIELD_NAME.MAJOR)"
          :values="pieUnits"
        ></SortingToggle>
      </template>
      <PieChart
        :field="FIELD_NAME.MAJOR"
        :data="calcStatistics(FIELD_NAME.MAJOR)"
        :unit="unitMajor"
      ></PieChart>
    </v-card>
    <v-card class="card" :title="getTitle(FIELD_NAME.MASTER_UNIVERSITY)" elevation="16">
      <template v-slot:title>
        <SortingToggle
          v-model="unitMaster"
          class="card-title-toggle"
          :title="getTitle(FIELD_NAME.MAJOR)"
          :values="pieUnits"
        ></SortingToggle>
      </template>
      <PieChart
        :field="FIELD_NAME.MASTER_UNIVERSITY"
        :data="calcStatistics(FIELD_NAME.MASTER_UNIVERSITY)"
        :unit="unitMaster"
      ></PieChart>
    </v-card>
    <v-card class="card" :title="getTitle(FIELD_NAME.PH_D_UNIVERSITY)" elevation="16">
      <template v-slot:title>
        <SortingToggle
          v-model="unitPhd"
          class="card-title-toggle"
          :title="getTitle(FIELD_NAME.MAJOR)"
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
