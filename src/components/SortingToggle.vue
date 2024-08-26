<script setup>
defineProps({
  title: String,
  values: Array
})

const sortingValue = defineModel()
</script>

<template>
  <div class="card-title">
    <span class="card-title-label">{{ title }}</span>
    <v-btn-toggle
      v-model="sortingValue"
      class="card-title-toggle"
      density="compact"
      variant="outlined"
      mandatory
    >
      <v-btn v-for="(item, i) in values" :key="i" :value="item.value">
        <span>{{ item.text }}</span>
      </v-btn>
    </v-btn-toggle>
  </div>
</template>

<style scoped>
.card-title {
  display: flex;
}

.card-title-label {
  flex: none;
}

.card-title-toggle {
  margin-left: auto;
}
</style>
