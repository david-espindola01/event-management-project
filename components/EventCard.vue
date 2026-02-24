<template>
  <article class="event-card">
    <div class="meta">
      <h2>{{ event.title }}</h2>
      <p class="date">{{ event.date }}</p>
    </div>
    <div class="actions">
      <button class="action">Ver detalles</button>
    </div>
  </article>
</template>

<script setup>
defineProps({ event: { type: Object, required: true } })
</script>
