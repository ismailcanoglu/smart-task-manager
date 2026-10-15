
<script setup>
import { ref, computed, onMounted } from 'vue'

import TaskForm from './components/TaskForm.vue'
import TaskList from './components/TaskList.vue'
import TaskFilters from './components/TaskFilters.vue'
import StatCard from './components/StatCard.vue'
import { taskApi as taskService } from './services/taskApi' 

// Reactive state
const tasks = ref([])
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const loaded = ref(false)

const searchQuery = ref('')
const statusFilter = ref('all')
const pendingIds = ref([])

// Derived state
const totalTasks = computed(() => tasks.value.length)

const completedTasks = computed(() =>
  tasks.value.filter(task => task.completed).length
)

const pendingTasks = computed(() =>
  totalTasks.value - completedTasks.value
)

const completionRate = computed(() =>
  totalTasks.value === 0
    ? 0
    : Math.round(
        (completedTasks.value / totalTasks.value) * 100
      )
)

// Arama ve filtreleme
const filteredTasks = computed(() => {
  const query = searchQuery.value
    .trim()
    .toLocaleLowerCase('tr')

  return tasks.value.filter(task => {
    const matchesSearch = task.title
      .toLocaleLowerCase('tr')
      .includes(query)

    const matchesStatus =
      statusFilter.value === 'all' ||
      (statusFilter.value === 'completed' && task.completed) ||
      (statusFilter.value === 'pending' && !task.completed)

    return matchesSearch && matchesStatus
  })
})

// API operations
async function loadTasks() {
  loading.value = true
  error.value = ''

  try {
    tasks.value = await taskService.getAll()
    loaded.value = true
  } catch (err) {
    error.value = `Görevler yüklenemedi: ${err.message}`
  } finally {
    loading.value = false
  }
}

async function addTask(title, done) {
  if (saving.value) {
    done(false)
    return
  }

  saving.value = true
  error.value = ''

  try {
    const task = await taskService.create(title)
    tasks.value.push(task)
    done(true)
  } catch (err) {
    error.value = `Görev eklenemedi: ${err.message}`
    done(false)
  } finally {
    saving.value = false
  }
}

async function toggleTask(id) {
  if (pendingIds.value.includes(id)) return

  pendingIds.value.push(id)
  error.value = ''

  try {
    const updated = await taskService.toggle(id)

    tasks.value = tasks.value.map(task =>
      task.id === id ? updated : task
    )
  } catch (err) {
    error.value = `Görev güncellenemedi: ${err.message}`
  } finally {
    pendingIds.value = pendingIds.value.filter(
      pendingId => pendingId !== id
    )
  }
}

async function deleteTask(id) {
  if (pendingIds.value.includes(id)) return

  pendingIds.value.push(id)
  error.value = ''

  try {
    await taskService.remove(id)

    tasks.value = tasks.value.filter(
      task => task.id !== id
    )
  } catch (err) {
    error.value = `Görev silinemedi: ${err.message}`
  } finally {
    pendingIds.value = pendingIds.value.filter(
      pendingId => pendingId !== id
    )
  }
}

onMounted(loadTasks)
</script>

<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="brand">
        <span class="brand-icon">✓</span>
        <h2>TaskFlow</h2>
      </div>

      <nav aria-label="Ana menü">
        <a href="#dashboard" class="active">Dashboard</a>
        <a href="#tasks">Görevlerim</a>
      </nav>

      <div class="sidebar-footer">
        TaskFlow v0.3
      </div>
    </aside>

    <main class="main-content" id="dashboard">
      <header class="header">
        <div>
          <h1>Dashboard</h1>
          <p>Görevlerini yönet, ilerlemeni takip et.</p>
        </div>
        <div class="avatar" aria-label="TaskFlow">TF</div>
      </header>

      <section class="stats" aria-label="Görev istatistikleri">
        <StatCard title="Toplam Görev" :value="totalTasks" />
        <StatCard title="Tamamlanan" :value="completedTasks" />
        <StatCard title="Bekleyen" :value="pendingTasks" />
        <StatCard title="Başarı Oranı (%)" :value="completionRate" />
      </section>

      <section class="task-section" id="tasks">
        <div class="section-heading">
          <h2>Görevlerim</h2>
          <span>{{ filteredTasks.length }} görev gösteriliyor</span>
        </div>

        <TaskForm
          :saving="saving"
          @add-task="addTask"
        />

        <TaskFilters
          v-model:search="searchQuery"
          v-model:filter="statusFilter"
        />

        <div v-if="error" class="error" role="alert">
          <p>{{ error }}</p>
          <button
            v-if="!loaded"
            type="button"
            @click="loadTasks"
          >
            Tekrar dene
          </button>
        </div>

        <p v-if="loading" class="loading" role="status">
          Görevler yükleniyor...
        </p>

        <TaskList
          v-else-if="loaded"
          :tasks="filteredTasks"
          :pending-ids="pendingIds"
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
  display: flex;
  flex-direction: column;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 40px;
}

.brand h2 {
  color: #4f46e5;
  margin: 0;
}

.brand-icon {
  background: #4f46e5;
  color: white;
  padding: 8px 12px;
  border-radius: 10px;
}

.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sidebar a {
  text-decoration: none;
  color: #6b7280;
  padding: 12px;
  border-radius: 8px;
}

.sidebar a:hover,
.sidebar a.active {
  background: #eef2ff;
  color: #4f46e5;
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 25px;
  color: #9ca3af;
  font-size: 12px;
}

.main-content {
  min-width: 0;
  padding: 40px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 30px;
}

.header h1 {
  margin: 0;
}

.header p {
  color: #6b7280;
}

.avatar {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  background: #4f46e5;
  color: white;
  border-radius: 50%;
  font-weight: bold;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 30px;
}

.task-section {
  background: white;
  padding: 25px;
  border-radius: 14px;
  box-shadow: 0 4px 20px #00000008;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 22px;
}

.section-heading h2 {
  margin: 0;
}

.section-heading span {
  font-size: 13px;
  color: #6b7280;
}

.error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.error button {
  padding: 8px 12px;
  border: 0;
  border-radius: 6px;
  background: #b91c1c;
  color: white;
  cursor: pointer;
}

.loading {
  padding: 25px;
  text-align: center;
  color: #6b7280;
}

@media (max-width: 1100px) {
  .stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .app-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
    padding: 16px;
  }

  .brand {
    margin-bottom: 16px;
  }

  .sidebar nav {
    flex-direction: row;
  }

  .sidebar-footer {
    display: none;
  }

  .main-content {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .stats {
    grid-template-columns: 1fr;
  }

  .task-section {
    padding: 18px;
  }
}
</style>
