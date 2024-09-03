<script setup>
import { isMobile } from '@/util/MediaQuery'
import { mdiContentCopy } from '@mdi/js'
import { FIELD_NAME, getTitle, getTitleForMobile } from '@/util/DataHelper'

defineProps({
  data: Array,
  preLine: Boolean
})

const copy = (value) => {
  navigator.clipboard.writeText(value)
}
</script>

<template>
  <v-table density="compact">
    <tbody>
      <template v-for="(item, i) in data" :key="i">
        <tr v-if="item.value">
          <th class="table-header">{{ isMobile ? getTitleForMobile(item.title) : item.title }}</th>
          <td class="table-cell" :class="{ 'pre-line': preLine }">
            {{ isMobile && preLine ? item.value.replaceAll(', ', '\n') : item.value }}
            <v-icon
              v-if="item.title === getTitle(FIELD_NAME.ID)"
              class="copy-icon"
              color="#9E9E9E"
              :icon="mdiContentCopy"
              @click="copy(item.value)"
            ></v-icon>
          </td>
        </tr>
      </template>
    </tbody>
  </v-table>
</template>

<style scoped>
.table-header {
  min-width: 230px;
}

.copy-icon {
  margin-left: 10px;
}

@media only screen and (max-width: 600px) {
  .table-header {
    white-space: pre;
    width: 100px;
    min-width: 100px;
  }

  .table-cell.pre-line {
    white-space: pre-line;
  }
}
</style>
