<template>
  <div class="container">
    <h1>Catálogo de eventos</h1>
    <div class="grid">
      <EventCard v-for="n in 6" :key="n" :event="{ title: 'Evento '+n, date: '2026-03-01' }" />
    </div>
  </div>
</template>

<script setup>
import EventCard from '~/components/EventCard.vue'
</script>
