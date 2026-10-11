
<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <article class="stat-card">
    <h3>{{ title }}</h3>
    <strong>{{ value }}</strong>
  </article>
</template>

<style scoped>
.stat-card {
  background: #eef2ff;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e0e7ff;
}

h3 {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  margin: 0 0 15px;
}

strong {
  font-size: 32px;
  color: #4f46e5;
}
</style>
