<script setup>
import { onMounted, ref } from 'vue'
import { mdiMagnify } from '@mdi/js'
import ItemDetail from '@/components/ItemDetail.vue'
import { useRoute, useRouter } from 'vue-router'
import { FIELD_NAME, getTitle, getDetailByFieldNames, getDataByFilter } from '@/util/DataHelper'
import { isMobile } from '@/util/MediaQuery'

const route = useRoute()
const router = useRouter()

const search = ref()
const filteredData = ref([])
const headers = ref([
  { title: getTitle(FIELD_NAME.MAJOR), key: FIELD_NAME.MAJOR, nowrap: true },
  {
    title: getTitle(FIELD_NAME.MASTER_UNIVERSITY),
    key: FIELD_NAME.MASTER_UNIVERSITY
  },
  {
    title: getTitle(FIELD_NAME.PH_D_UNIVERSITY),
    key: FIELD_NAME.PH_D_UNIVERSITY
  },
  {
    title: getTitle(FIELD_NAME.COMPANY_NAME),
    key: FIELD_NAME.COMPANY_NAME
  },
  {
    title: getTitle(FIELD_NAME.COMPANY_TASK_GROUP),
    key: FIELD_NAME.COMPANY_TASK_GROUP
  },
  {
    title: getTitle(FIELD_NAME.YEAR_OF_ADMISSION),
    key: FIELD_NAME.YEAR_OF_ADMISSION
  }
])

onMounted(() => {
  initDataByQuery()
})

const initDataByQuery = () => {
  const [path, value] = Object.entries(route.query)?.[0] ?? []
  filteredData.value = getDataByFilter(path, value)
}

const getDetail = (item) =>
  getDetailByFieldNames(item, [
    FIELD_NAME.MAJOR,
    FIELD_NAME.MASTER_UNIVERSITY,
    FIELD_NAME.PH_D_UNIVERSITY,
    FIELD_NAME.COMPANY_NAME,
    FIELD_NAME.COMPANY_TASK_GROUP,
    FIELD_NAME.YEAR_OF_ADMISSION
  ])

const handleRowClick = (event, { item }) => {
  router.push({ path: '/detail', query: { id: item.id } })
}
</script>

<template>
  <template v-if="isMobile">
    <v-data-iterator :items="filteredData" :items-per-page="-1">
      <template v-slot:default="{ items }">
        <v-sheet v-for="(item, i) in items" :key="i" class="sheet" elevation="16">
          <ItemDetail :data="getDetail(item.raw)"></ItemDetail>
          <div class="button-container">
            <v-btn @click="(e) => handleRowClick(e, { item: item.raw })">자세히 보기</v-btn>
          </div>
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
      class="tableview"
      :headers="headers"
      :items="filteredData"
      :items-per-page="-1"
      :search="search"
      width="1000"
      hover
      hide-default-footer
      @click:row="handleRowClick"
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

  .button-container {
    display: flex;
    justify-content: center;
    padding-top: 5px;
  }
}
</style>

<style>
.tableview thead .v-data-table__td {
  text-wrap: nowrap;
}

.tableview tbody .v-data-table__td {
  white-space: pre-line;
}
</style>
