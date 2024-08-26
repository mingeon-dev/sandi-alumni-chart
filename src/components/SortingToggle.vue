<script setup>
defineProps({
  title: String
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
      <v-btn value="label">
        <span>이름순</span>
      </v-btn>
      <v-btn value="data">
        <span>인원순</span>
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
