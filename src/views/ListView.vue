<script setup>
import { onMounted, ref } from 'vue'
import { mdiMagnify } from '@mdi/js'
import { useRoute } from 'vue-router'
import { FIELD_NAME, NESTED_FIELD_NAME, getTitle, getDataByFilter } from '@/util/DataHelper'
import { isMobile } from '@/util/MediaQuery'

const route = useRoute()

const search = ref()
const filteredData = ref([])
const headers = ref([
  { title: getTitle(FIELD_NAME.MAJOR), key: FIELD_NAME.MAJOR },
  {
    title: getTitle(NESTED_FIELD_NAME.MASTER_UNIVERSITY),
    key: NESTED_FIELD_NAME.MASTER_UNIVERSITY,
    minWidth: '120px'
  },
  {
    title: getTitle(NESTED_FIELD_NAME.PH_D_UNIVERSITY),
    key: NESTED_FIELD_NAME.PH_D_UNIVERSITY,
    minWidth: '120px'
  },
  { title: getTitle(NESTED_FIELD_NAME.COMPANY_NAME), key: NESTED_FIELD_NAME.COMPANY_NAME },
  {
    title: getTitle(NESTED_FIELD_NAME.COMPANY_TASK_GROUP),
    key: NESTED_FIELD_NAME.COMPANY_TASK_GROUP
  },
  {
    title: getTitle(FIELD_NAME.YEAR_OF_ADMISSION),
    key: FIELD_NAME.YEAR_OF_ADMISSION,
    minWidth: '80px'
  }
])

onMounted(() => {
  initDataByQuery()
})

const initDataByQuery = () => {
  const [path, value] = Object.entries(route.query)?.[0] ?? []
  filteredData.value = getDataByFilter(path, value)
}

const getValue = (item, path) => {
  const keys = path.split('.')
  return keys.reduce((xs, x) => xs?.[x] ?? null, item)
}
</script>

<template>
  <template v-if="isMobile">
    <v-data-iterator :items="filteredData" :items-per-page="-1">
      <template v-slot:default="{ items }">
        <v-sheet v-for="(item, i) in items" :key="i" class="sheet" elevation="16">
          <v-table density="compact">
            <tbody>
              <tr align="right">
                <th class="table-header">{{ getTitle(FIELD_NAME.MAJOR) }}</th>
                <td>{{ getValue(item.raw, FIELD_NAME.MAJOR) }}</td>
              </tr>
              <tr v-if="item.raw[FIELD_NAME.MASTER]" align="right">
                <th class="table-header">{{ getTitle(NESTED_FIELD_NAME.MASTER_UNIVERSITY) }}</th>
                <td>{{ getValue(item.raw, NESTED_FIELD_NAME.MASTER_UNIVERSITY) }}</td>
              </tr>
              <tr v-if="item.raw[FIELD_NAME.PH_D]" align="right">
                <th class="table-header">{{ getTitle(NESTED_FIELD_NAME.PH_D_UNIVERSITY) }}</th>
                <td>{{ getValue(item.raw, NESTED_FIELD_NAME.PH_D_UNIVERSITY) }}</td>
              </tr>
              <tr align="right">
                <th class="table-header">{{ getTitle(NESTED_FIELD_NAME.COMPANY_NAME) }}</th>
                <td>{{ getValue(item.raw, NESTED_FIELD_NAME.COMPANY_NAME) }}</td>
              </tr>
              <tr align="right">
                <th class="table-header">{{ getTitle(NESTED_FIELD_NAME.COMPANY_TASK_GROUP) }}</th>
                <td>{{ getValue(item.raw, NESTED_FIELD_NAME.COMPANY_TASK_GROUP) }}</td>
              </tr>
              <tr align="right">
                <th class="table-header">{{ getTitle(FIELD_NAME.YEAR_OF_ADMISSION) }}</th>
                <td>{{ getValue(item.raw, FIELD_NAME.YEAR_OF_ADMISSION) }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-sheet>
      </template>
    </v-data-iterator>
  </template>
  <v-sheet v-else class="sheet" elevation="16">
    <v-text-field
      class="text-field"
      v-model="search"
      label="키워드로 검색해보세요."
      :prepend-inner-icon="mdiMagnify"
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
  </v-sheet>
</template>

<style scoped>
.text-field {
  margin-bottom: 2rem;
}

.sheet {
  margin: 2rem;
  padding: 2rem;
}

@media only screen and (max-width: 600px) {
  .sheet {
    width: 350px;
    height: auto;
    margin: 0 auto 2rem;
    padding: 1rem;
  }

  .table-header {
    width: 100px;
  }
}
</style>
