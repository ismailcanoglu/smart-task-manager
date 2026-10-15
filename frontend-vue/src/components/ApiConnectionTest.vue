
<script setup>
import { ref, onMounted } from "vue";
import { taskApi } from "../services/taskApi";

const tasks = ref([]);
const title = ref("");
const loading = ref(false);
const error = ref("");

async function loadTasks() {
  loading.value = true;
  error.value = "";

  try {
    tasks.value = await taskApi.getAll();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

async function addTask() {
  if (!title.value.trim()) return;

  try {
    await taskApi.create(title.value.trim());
    title.value = "";
    await loadTasks();
  } catch (err) {
    error.value = err.message;
  }
}

async function toggleTask(id) {
  try {
    await taskApi.toggle(id);
    await loadTasks();
  } catch (err) {
    error.value = err.message;
  }
}

async function deleteTask(id) {
  try {
    await taskApi.remove(id);
    await loadTasks();
  } catch (err) {
    error.value = err.message;
  }
}

onMounted(loadTasks);
</script>

<template>
  <section>
    <h2>PostgreSQL Görev Testi</h2>

    <form @submit.prevent="addTask">
      <input
        v-model="title"
        placeholder="Yeni görev"
        minlength="3"
        maxlength="200"
        required
      />
      <button type="submit">Ekle</button>
    </form>

    <p v-if="loading">Yükleniyor...</p>
    <p v-if="error" style="color: red">{{ error }}</p>

    <ul>
      <li v-for="task in tasks" :key="task.id">
        <input
          type="checkbox"
          :checked="task.completed"
          @change="toggleTask(task.id)"
        />

        <span>{{ task.title }}</span>

        <button @click="deleteTask(task.id)">
          Sil
        </button>
      </li>
    </ul>
  </section>
</template>
