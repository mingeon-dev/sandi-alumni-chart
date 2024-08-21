<script setup>
import { computed } from 'vue'
import data from '@/assets/data.json'
import PieChart from './chart/PieChart.vue'
import HorizontalBarChart from './chart/HorizontalBarChart.vue'

const FIELD_NAME = {
  MAJOR: 'major',
  MASTER: 'master',
  PH_D: 'phD',
  UNIVERSITY: 'university',
  COMPANY: 'company',
  NAME: 'name',
  TASK_GROUP: 'taskGroup',
  YEAR_OF_ADMISSION: 'yearOfAdmission'
}

const majorData = computed(() => createData(data, FIELD_NAME.MAJOR))
const masterData = computed(() =>
  createData(
    data.map((item) => item[FIELD_NAME.MASTER]).filter((item) => item),
    FIELD_NAME.UNIVERSITY
  )
)
const phDData = computed(() =>
  createData(
    data.map((item) => item[FIELD_NAME.PH_D]).filter((item) => item),
    FIELD_NAME.UNIVERSITY
  )
)
const companyNameData = computed(() =>
  createData(
    data.map((item) => item[FIELD_NAME.COMPANY]),
    FIELD_NAME.NAME
  )
)
const companyTaskGroupData = computed(() =>
  createData(
    data.map((item) => item[FIELD_NAME.COMPANY]),
    FIELD_NAME.TASK_GROUP
  )
)

const yearOfAdmissionData = computed(() => createData(data, FIELD_NAME.YEAR_OF_ADMISSION))

const createData = (data, key) => {
  return data.reduce((accumulator, currentValue) => {
    const values = currentValue[key].split(', ')
    values.forEach((value) => {
      if (!accumulator[value]) accumulator[value] = 0
      accumulator[value]++
    })
    return accumulator
  }, {})
}
</script>

<template>
  <div class="container">
    <v-card class="card" title="학사 전공" elevation="16">
      <PieChart :data="majorData"></PieChart>
    </v-card>
    <v-card class="card" title="석사 대학원" elevation="16">
      <PieChart :data="masterData"></PieChart>
    </v-card>
    <v-card class="card" title="박사 대학원" elevation="16">
      <PieChart :data="phDData"></PieChart>
    </v-card>
    <v-card class="card" title="현직장 현황" elevation="16">
      <HorizontalBarChart :data="companyNameData"></HorizontalBarChart>
    </v-card>
    <v-card class="card" title="현직 업무 직군" elevation="16">
      <HorizontalBarChart :data="companyTaskGroupData"></HorizontalBarChart>
    </v-card>
    <v-card class="card" title="참여 학번" elevation="16">
      <HorizontalBarChart :data="yearOfAdmissionData"></HorizontalBarChart>
    </v-card>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
}

.card {
  width: 400px;
  height: 496px;
  margin-left: 2rem;
  margin-bottom: 2rem;
}

@media only screen and (max-width: 600px) {
  .card {
    width: 350px;
    height: auto;
    margin: 0 auto 2rem;
  }
}
</style>
