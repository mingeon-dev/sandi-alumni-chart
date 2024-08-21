<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { FIELD_NAME, NESTED_FIELD_NAME, getTitle, getDataByFilter } from '@/util/DataHelper'

const route = useRoute()

const search = ref()
const filteredData = ref([])
const headers = ref([
  { title: getTitle(FIELD_NAME.MAJOR), key: FIELD_NAME.MAJOR },
  {
    title: getTitle(NESTED_FIELD_NAME.MASTER_UNIVERSITY),
    key: NESTED_FIELD_NAME.MASTER_UNIVERSITY
  },
  { title: getTitle(NESTED_FIELD_NAME.PH_D_UNIVERSITY), key: NESTED_FIELD_NAME.PH_D_UNIVERSITY },
  {
    title: '현직',
    align: 'center',
    children: [
      { title: getTitle(NESTED_FIELD_NAME.COMPANY_NAME), key: NESTED_FIELD_NAME.COMPANY_NAME },
      {
        title: getTitle(NESTED_FIELD_NAME.COMPANY_TASK_GROUP),
        key: NESTED_FIELD_NAME.COMPANY_TASK_GROUP
      }
    ]
  },
  { title: getTitle(FIELD_NAME.YEAR_OF_ADMISSION), key: FIELD_NAME.YEAR_OF_ADMISSION }
])

onMounted(() => {
  initDataByQuery()
})

const initDataByQuery = () => {
  const [path, value] = Object.entries(route.query)?.[0] ?? []
  filteredData.value = getDataByFilter(path, value)
}
</script>

<template>
  <v-card class="card" elevation="16">
    <v-text-field
      class="text-field"
      v-model="search"
      label="키워드로 검색해보세요."
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      hide-details
      single-line
    ></v-text-field>
    <v-data-table
      :headers="headers"
      :items="filteredData"
      :items-per-page="-1"
      :search="search"
      width="1000"
      hide-default-footer
    ></v-data-table>
  </v-card>
</template>

<style scoped>
.text-field {
  margin-bottom: 2rem;
}

.card {
  margin: 2rem;
  padding: 2rem;
}

@media only screen and (max-width: 600px) {
  .card {
    width: 350px;
    height: auto;
    margin: 0 auto 2rem;
  }
}
</style>
