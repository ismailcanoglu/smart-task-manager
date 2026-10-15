
<script setup>
defineProps({
  search: {
    type: String,
    required: true
  },
  filter: {
    type: String,
    required: true
  }
})

const emit = defineEmits([
  'update:search',
  'update:filter'
])

const filters = [
  { label: 'Tümü', value: 'all' },
  { label: 'Bekleyen', value: 'pending' },
  { label: 'Tamamlanan', value: 'completed' }
]
</script>

<template>
  <div class="filters">
    <input
      type="search"
      :value="search"
      placeholder="Görevlerde ara..."
      aria-label="Görevlerde ara"
      @input="emit('update:search', $event.target.value)"
    />

    <div class="filter-buttons" aria-label="Görev filtresi">
      <button
        v-for="item in filters"
        :key="item.value"
        type="button"
        :class="{ active: filter === item.value }"
        :aria-pressed="filter === item.value"
        @click="emit('update:filter', item.value)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 20px;
}

input {
  flex: 1;
  min-width: 180px;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 9px;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

button {
  padding: 10px 13px;
  border: 0;
  border-radius: 8px;
  background: #f3f4f6;
  color: #4b5563;
  cursor: pointer;
}

button.active {
  background: #4f46e5;
  color: white;
}
</style>
