<template>
  <div class="catalog-layout">
    <div class="catalog-head">
      <h2 class="catalog-title">Explora los eventos</h2>
      <p class="count">{{ filtered.length }} eventos encontrados</p>
    </div>

    <div class="search-row">
      <SearchBar :categories="categories" @update:query="onQuery" @update:category="onCategory" />
    </div>

    <div class="content-row">
      <aside class="filters-col">
        <Filters @update:filters="onFilters" />
      </aside>

      <section class="catalog-col">
        <div class="grid">
          <EventCard v-for="e in filtered" :key="e.id" :event="e" />
        </div>
        <div v-if="filtered.length === 0" class="empty-state">
          <p>🎟️</p>
          <p>No se encontraron eventos</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import events from '~/data/events.js'

const query = ref('')
const selectedCategory = ref('')
const activeFilters = ref({ free: false, presencial: false, online: false })
const allEvents = ref(events)
const categories = Array.from(new Set(events.map(e => e.category)))

function onQuery(v) { query.value = v }
function onCategory(v) { selectedCategory.value = v }
function onFilters(v) { activeFilters.value = v }

const filtered = computed(() => {
  return allEvents.value.filter(e => {
    const matchQuery = !query.value ||
      e.title.toLowerCase().includes(query.value.toLowerCase()) ||
      e.location.toLowerCase().includes(query.value.toLowerCase())

    const matchCategory = !selectedCategory.value || e.category === selectedCategory.value

    const matchFree = !activeFilters.value.free || e.price === 0
    const matchPresencial = !activeFilters.value.presencial || e.modality === 'presencial'
    const matchOnline = !activeFilters.value.online || e.modality === 'online'

    return matchQuery && matchCategory && matchFree && matchPresencial && matchOnline
  })
})
</script>