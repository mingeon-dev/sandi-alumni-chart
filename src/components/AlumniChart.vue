<script setup>
import PieChart from './chart/PieChart.vue'
import HorizontalBarChart from './chart/HorizontalBarChart.vue'
import { FIELD_NAME, NESTED_FIELD_NAME, calcStatistics } from '@/util/DataHelper'
</script>

<template>
  <div class="container">
    <v-card class="card" title="학사 전공" elevation="16">
      <PieChart :field="FIELD_NAME.MAJOR" :data="calcStatistics(FIELD_NAME.MAJOR)"></PieChart>
    </v-card>
    <v-card class="card" title="석사 대학원" elevation="16">
      <PieChart
        :field="NESTED_FIELD_NAME.MASTER_UNIVERSITY"
        :data="calcStatistics(NESTED_FIELD_NAME.MASTER_UNIVERSITY)"
      ></PieChart>
    </v-card>
    <v-card class="card" title="박사 대학원" elevation="16">
      <PieChart
        :field="NESTED_FIELD_NAME.PH_D_UNIVERSITY"
        :data="calcStatistics(NESTED_FIELD_NAME.PH_D_UNIVERSITY)"
      ></PieChart>
    </v-card>
    <v-card class="card" title="현직장 현황" elevation="16">
      <HorizontalBarChart
        :data="calcStatistics(NESTED_FIELD_NAME.COMPANY_NAME)"
      ></HorizontalBarChart>
    </v-card>
    <v-card class="card" title="현직 업무 직군" elevation="16">
      <HorizontalBarChart
        :data="calcStatistics(NESTED_FIELD_NAME.COMPANY_TASK_GROUP)"
      ></HorizontalBarChart>
    </v-card>
    <v-card class="card" title="참여 학번" elevation="16">
      <HorizontalBarChart :data="calcStatistics(FIELD_NAME.YEAR_OF_ADMISSION)"></HorizontalBarChart>
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
