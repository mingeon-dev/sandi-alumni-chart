<script setup>
import PieChart from './chart/PieChart.vue'
import HorizontalBarChart from './chart/HorizontalBarChart.vue'
import { FIELD_NAME, NESTED_FIELD_NAME, getTitle, calcStatistics } from '@/util/DataHelper'
</script>

<template>
  <div class="container">
    <v-card class="card" :title="getTitle(FIELD_NAME.MAJOR)" elevation="16">
      <PieChart :field="FIELD_NAME.MAJOR" :data="calcStatistics(FIELD_NAME.MAJOR)"></PieChart>
    </v-card>
    <v-card class="card" :title="getTitle(NESTED_FIELD_NAME.MASTER_UNIVERSITY)" elevation="16">
      <PieChart
        :field="NESTED_FIELD_NAME.MASTER_UNIVERSITY"
        :data="calcStatistics(NESTED_FIELD_NAME.MASTER_UNIVERSITY)"
      ></PieChart>
    </v-card>
    <v-card class="card" :title="getTitle(NESTED_FIELD_NAME.PH_D_UNIVERSITY)" elevation="16">
      <PieChart
        :field="NESTED_FIELD_NAME.PH_D_UNIVERSITY"
        :data="calcStatistics(NESTED_FIELD_NAME.PH_D_UNIVERSITY)"
      ></PieChart>
    </v-card>
    <v-card class="card" :title="getTitle(NESTED_FIELD_NAME.COMPANY_NAME)" elevation="16">
      <HorizontalBarChart
        :field="NESTED_FIELD_NAME.COMPANY_NAME"
        :data="calcStatistics(NESTED_FIELD_NAME.COMPANY_NAME)"
      ></HorizontalBarChart>
    </v-card>
    <v-card class="card" :title="getTitle(NESTED_FIELD_NAME.COMPANY_TASK_GROUP)" elevation="16">
      <HorizontalBarChart
        :field="NESTED_FIELD_NAME.COMPANY_TASK_GROUP"
        :data="calcStatistics(NESTED_FIELD_NAME.COMPANY_TASK_GROUP)"
      ></HorizontalBarChart>
    </v-card>
    <v-card class="card" :title="getTitle(FIELD_NAME.YEAR_OF_ADMISSION)" elevation="16">
      <HorizontalBarChart
        :field="FIELD_NAME.YEAR_OF_ADMISSION"
        :data="calcStatistics(FIELD_NAME.YEAR_OF_ADMISSION)"
      ></HorizontalBarChart>
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
