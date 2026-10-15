
<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  saving: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['add-task'])

const newTask = ref('')

const trimmedTitle = computed(() => newTask.value.trim())

const validationError = computed(() => {
  if (!trimmedTitle.value) return 'Görev başlığı gerekli.'
  if (trimmedTitle.value.length < 3) {
    return 'En az 3 karakter giriniz.'
  }
  if (trimmedTitle.value.length > 200) {
    return 'En fazla 200 karakter girebilirsiniz.'
  }
  return ''
})

const canSubmit = computed(() =>
  !props.saving && !validationError.value
)

async function handleSubmit() {
  if (!canSubmit.value) return

  const title = trimmedTitle.value

  // Parent başarı durumunu boolean olarak döndürür.
  const success = await new Promise(resolve => {
    emit('add-task', title, resolve)
  })

  if (success && newTask.value.trim() === title) {
    newTask.value = ''
  }
}
</script>

<template>
  <form class="task-form" @submit.prevent="handleSubmit">
    <div class="input-group">
      <input
        v-model="newTask"
        type="text"
        maxlength="200"
        placeholder="Örneğin: Vue testlerini yaz"
        aria-label="Görev başlığı"
        :aria-invalid="Boolean(newTask && validationError)"
        :disabled="saving"
      />

      <small
        v-if="newTask && validationError"
        class="validation-error"
      >
        {{ validationError }}
      </small>
    </div>

    <button type="submit" :disabled="!canSubmit">
      {{ saving ? 'Kaydediliyor...' : '+ Görev Ekle' }}
    </button>
  </form>
</template>

<style scoped>
.task-form {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 24px;
}

.input-group {
  flex: 1;
  min-width: 0;
}

input {
  width: 100%;
  padding: 13px;
  border: 1px solid #d1d5db;
  border-radius: 9px;
  outline-color: #4f46e5;
}

.validation-error {
  display: block;
  margin-top: 6px;
  color: #dc2626;
}

button {
  padding: 13px 18px;
  background: #4f46e5;
  color: white;
  border: 0;
  border-radius: 9px;
  cursor: pointer;
}

button:disabled {
  opacity: .5;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .task-form {
    flex-direction: column;
  }

  .input-group, button {
    width: 100%;
  }
}
</style>
