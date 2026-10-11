
<script setup>
import { ref } from 'vue'

const newTask = ref('')

const emit = defineEmits(['add-task'])

function handleSubmit() {
  const title = newTask.value.trim()

  if (!title) return

  emit('add-task', title)

  newTask.value = ''
}
</script>

<template>
  <form class="task-form" @submit.prevent="handleSubmit">
    <input
      v-model="newTask"
      type="text"
      placeholder="Yeni görev ekle..."
      maxlength="200"
      required
      aria-label="Yeni görev başlığı"
    />

    <button type="submit">
      + Görev Ekle
    </button>
  </form>
</template>

<style scoped>
.task-form {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
}

input {
  flex: 1;
  min-width: 0;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}

button {
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 18px;
  cursor: pointer;
}

button:hover {
  background: #4338ca;
}

@media (max-width: 600px) {
  .task-form {
    flex-direction: column;
  }
}
</style>
