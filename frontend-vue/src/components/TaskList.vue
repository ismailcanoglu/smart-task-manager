
<script setup>
defineProps({
  tasks: {
    type: Array,
    required: true
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
      Henüz görev bulunmuyor.
    </p>

    <ul v-else>
      <li v-for="task in tasks" :key="task.id">
        <input
          type="checkbox"
          :checked="task.completed"
          :aria-label="`${task.title} tamamlandı`"
          @change="emit('toggle-task', task.id)"
        />

        <span :class="{ completed: task.completed }">
          {{ task.title }}
        </span>

        <button
          class="delete-btn"
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
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 0;
  border-bottom: 1px solid #e5e7eb;
}

li span {
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
}

.completed {
  text-decoration: line-through;
  color: #9ca3af;
}

.delete-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 9px 14px;
  border-radius: 7px;
  cursor: pointer;
}

.empty {
  color: #6b7280;
  text-align: center;
  padding: 30px;
}
</style>
