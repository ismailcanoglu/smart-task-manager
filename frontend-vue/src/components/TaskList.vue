
<script setup>
defineProps({
  tasks: {
    type: Array,
    required: true
  },
  pendingIds: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'toggle-task',
  'delete-task'
])
</script>

<template>
  <div class="task-list">
    <p v-if="tasks.length === 0" class="empty">
      Bu kriterlere uygun görev bulunamadı.
    </p>

    <ul v-else>
      <li v-for="task in tasks" :key="task.id">
        <input
          type="checkbox"
          :checked="task.completed"
          :disabled="pendingIds.includes(task.id)"
          :aria-label="`${task.title} tamamlandı`"
          @change="emit('toggle-task', task.id)"
        />

        <span :class="{ completed: task.completed }">
          {{ task.title }}
        </span>

        <span
          v-if="pendingIds.includes(task.id)"
          class="pending"
          role="status"
        >
          İşleniyor...
        </span>

        <button
          type="button"
          :disabled="pendingIds.includes(task.id)"
          @click="emit('delete-task', task.id)"
        >
          Sil
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
ul {
  padding: 0;
  list-style: none;
}

li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 0;
  border-bottom: 1px solid #e5e7eb;
}

li span:first-of-type {
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
}

.completed {
  text-decoration: line-through;
  color: #9ca3af;
}

.pending {
  font-size: 12px;
  color: #6b7280;
}

button {
  border: 0;
  background: #fee2e2;
  color: #b91c1c;
  padding: 9px 14px;
  border-radius: 7px;
  cursor: pointer;
}

button:disabled {
  opacity: .5;
  cursor: not-allowed;
}

.empty {
  text-align: center;
  color: #6b7280;
  padding: 30px;
}
</style>
