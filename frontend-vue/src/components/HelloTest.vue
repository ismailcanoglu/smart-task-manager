
<script setup>
defineProps({
  message: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <h2>{{ message }}</h2>
</template>
