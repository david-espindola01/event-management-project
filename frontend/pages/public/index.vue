<template>
  <div class="pub-shell">
    <header class="pub-header">
      <div class="pub-header-inner">
        <span class="pub-logo">🎟️ Eventos Boyacá</span>
      </div>
    </header>

    <main class="pub-main">
      <div class="pub-head">
        <h2 class="pub-title">Explora los eventos</h2>
        <p class="pub-count">{{ filtered.length }} evento(s) encontrado(s)</p>
      </div>

      <div class="pub-search">
        <SearchBar
          :categories="sortedActiveCategories"
          @update:query="q => query = q"
          @update:category="c => selectedCategory = c"
        />
      </div>

      <div class="pub-content">
        <aside class="pub-aside">
          <Filters @update:filters="f => activeFilters = f" />
        </aside>
        <section class="pub-grid-wrap">
          <div v-if="loading" style="text-align:center;padding:48px;color:var(--text-muted)">Cargando eventos…</div>
          <div v-else class="pub-grid">
            <EventCard v-for="e in filtered" :key="e.id_event" :event="e" />
          </div>
          <div v-if="!loading && filtered.length === 0" class="pub-empty">
            <p>🎟️</p>
            <p>No se encontraron eventos</p>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useEvents }     from '~/composables/useEvents'
import { useCategories } from '~/composables/useCategories'
import SearchBar from '~/components/public/SearchBar.vue'
import Filters   from '~/components/public/Filters.vue'
import EventCard from '~/components/public/EventCard.vue'

const { visibleEvents, loading, fetchEvents } = useEvents()
const { sortedActiveCategories, fetchCategories } = useCategories()

onMounted(async () => {
  await Promise.all([fetchEvents(), fetchCategories('asc')])
})

const query            = ref('')
const selectedCategory = ref<number | ''>('')
const activeFilters    = ref({ free: false, presencial: false, online: false })

const filtered = computed(() =>
  visibleEvents.value.filter(e => {
    const matchQuery    = !query.value ||
      e.NameEvent.toLowerCase().includes(query.value.toLowerCase()) ||
      e.location.toLowerCase().includes(query.value.toLowerCase())
    const matchCategory = !selectedCategory.value || e.Id_category === selectedCategory.value
    const matchFree     = !activeFilters.value.free || e.value === 0
    return matchQuery && matchCategory && matchFree
  })
)
</script>

<style>
:root {
  --primary:        #34656d;
  --primary-hover:  #2a535a;
  --primary-light:  #5d9ea8;
  --primary-pale:   #e8f4f5;
  --bg-base:        #f7f8fa;
  --bg-surface:     #ffffff;
  --bg-elevated:    #f0f2f5;
  --border:         #e4e7ec;
  --border-strong:  #cbd2dc;
  --text-primary:   #1a2332;
  --text-secondary: #4a5568;
  --text-muted:     #8a9bb0;
  --danger:         #c0392b;
  --radius-md:      8px;
  --radius-lg:      12px;
  --transition:     0.18s ease;
  --font-display:   'Inter', system-ui, sans-serif;
  --font-mono:      'Inter', system-ui, sans-serif;
}
*, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
body { font-family:var(--font-display); background:var(--bg-base); color:var(--text-primary); }
a { text-decoration:none; color:inherit; }

.pub-header { background:var(--bg-surface); border-bottom:1px solid var(--border); position:sticky; top:0; z-index:50; }
.pub-header-inner { max-width:1200px; margin:0 auto; padding:0 24px; height:56px; display:flex; align-items:center; justify-content:space-between; }
.pub-logo { font-weight:800; font-size:1.05rem; color:var(--primary); }
.pub-main    { max-width:1200px; margin:0 auto; padding:32px 24px; }
.pub-head    { display:flex; align-items:baseline; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:8px; }
.pub-title   { font-size:1.5rem; font-weight:800; }
.pub-count   { font-size:.82rem; color:var(--text-muted); }
.pub-search  { margin-bottom:24px; }
.pub-content { display:flex; gap:24px; align-items:flex-start; }
.pub-aside   { width:200px; flex-shrink:0; }
.pub-grid-wrap { flex:1; min-width:0; }
.pub-grid    { display:grid; grid-template-columns:repeat(auto-fill, minmax(280px,1fr)); gap:20px; }
.pub-empty   { text-align:center; padding:60px 20px; color:var(--text-muted); font-size:1.1rem; }

@media (max-width:768px) {
  .pub-content { flex-direction:column; }
  .pub-aside   { width:100%; }
  .pub-grid    { grid-template-columns:1fr; }
}
</style>