<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ItemDetail from '@/components/ItemDetail.vue'
import { FIELD_NAME, getDataByFilter, getDetailByFieldNames } from '@/util/DataHelper'

const route = useRoute()

const item = computed(() => getDataByFilter(FIELD_NAME.ID, route.query.id)[0])

const detail = computed(() => getDetailByFieldNames(item.value, Object.values(FIELD_NAME)))
</script>

<template>
  <v-sheet class="sheet" elevation="16">
    <ItemDetail :data="detail" pre-line></ItemDetail>
  </v-sheet>
</template>

<style scoped>
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
}
</style>
