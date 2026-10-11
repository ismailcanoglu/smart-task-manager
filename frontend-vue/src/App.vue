
<script setup>
import { ref, computed } from 'vue'

import TaskForm from './components/TaskForm.vue'
import TaskList from './components/TaskList.vue'
import StatCard from './components/StatCard.vue'

// Merkezi state
const tasks = ref([
  { id: 1, title: 'Vue component öğren', completed: true },
  { id: 2, title: 'Props ve emit kullan', completed: false },
  { id: 3, title: 'FastAPI bağlantısı kur', completed: false }
])

// Derived state
const totalTasks = computed(() => tasks.value.length)

const completedTasks = computed(() =>
  tasks.value.filter(task => task.completed).length
)

const pendingTasks = computed(() =>
  totalTasks.value - completedTasks.value
)

// Actions
function addTask(title) {
  tasks.value.push({
    id: crypto.randomUUID(),
    title,
    completed: false
  })
}

function toggleTask(id) {
  const task = tasks.value.find(task => task.id === id)

  if (task) {
    task.completed = !task.completed
  }
}

function deleteTask(id) {
  tasks.value = tasks.value.filter(
    task => task.id !== id
  )
}
</script>

<template>
  <div class="app-layout">

    <aside class="sidebar">
      <h2>TaskFlow</h2>

      <nav aria-label="Ana menü">
        <a href="#" class="active">Dashboard</a>
        <a href="#tasks">Görevlerim</a>
      </nav>
    </aside>

    <main class="main-content">
      <header>
        <h1>Dashboard</h1>
        <p>Görevlerini kolayca yönet.</p>
      </header>

      <section class="stats">
        <StatCard
          title="Toplam Görev"
          :value="totalTasks"
        />

        <StatCard
          title="Tamamlanan"
          :value="completedTasks"
        />

        <StatCard
          title="Bekleyen"
          :value="pendingTasks"
        />
      </section>

      <section class="task-section" id="tasks">
        <h2>Görevlerim</h2>

        <TaskForm @add-task="addTask" />

        <TaskList
          :tasks="tasks"
          @toggle-task="toggleTask"
          @delete-task="deleteTask"
        />
      </section>
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  min-height: 100vh;
  background: #f5f7fb;
  color: #1f2937;
}

.sidebar {
  background: white;
  padding: 30px 20px;
  border-right: 1px solid #e5e7eb;
}

.sidebar h2 {
  color: #4f46e5;
  margin: 0 0 40px;
}

.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sidebar a {
  padding: 12px;
  color: #6b7280;
  text-decoration: none;
  border-radius: 8px;
}

.sidebar a.active,
.sidebar a:hover {
  background: #eef2ff;
  color: #4f46e5;
}

.main-content {
  min-width: 0;
  padding: 40px;
}

header {
  margin-bottom: 30px;
}

header h1 {
  margin: 0;
}

header p {
  color: #6b7280;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.task-section {
  background: white;
  padding: 25px;
  border-radius: 12px;
}

@media (max-width: 768px) {
  .app-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
    padding: 15px;
  }

  .sidebar h2 {
    margin-bottom: 15px;
  }

  .sidebar nav {
    flex-direction: row;
  }

  .main-content {
    padding: 20px;
  }

  .stats {
    grid-template-columns: 1fr;
  }
}
</style>
