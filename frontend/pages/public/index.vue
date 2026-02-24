// pages/public/index.vue

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
          <div class="pub-grid">
            <EventCard v-for="e in filtered" :key="e.id" :event="e" />
          </div>
          <div v-if="filtered.length === 0" class="pub-empty">
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

const { visibleEvents }          = useEvents()
const { sortedActiveCategories } = useCategories()

const query            = ref('')
const selectedCategory = ref('')
const activeFilters    = ref({ free: false, presencial: false, online: false })

const filtered = computed(() =>
  visibleEvents.value.filter(e => {
    const matchQuery    = !query.value ||
      e.name.toLowerCase().includes(query.value.toLowerCase()) ||
      e.location.toLowerCase().includes(query.value.toLowerCase())
    const matchCategory = !selectedCategory.value || e.categoryId === selectedCategory.value
    const matchFree     = !activeFilters.value.free || e.price === 0
    return matchQuery && matchCategory && matchFree
  })
)
</script>

<style>
/* Variables globales (se repiten aquí en caso de que el layout default no las incluya) */
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
  --danger-border:  #f5c6c2;
  --danger-pale:    #fdf3f2;
  --radius-md:      8px;
  --radius-lg:      12px;
  --transition:     0.18s ease;
  --font-display:   'Inter', system-ui, sans-serif;
  --font-mono:      'Inter', system-ui, sans-serif;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--font-display); background: var(--bg-base); color: var(--text-primary); }
a { text-decoration: none; color: inherit; }

/* Header */
.pub-header { background: var(--bg-surface); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 50; }
.pub-header-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 56px; display: flex; align-items: center; justify-content: space-between; }
.pub-logo { font-weight: 800; font-size: 1.05rem; color: var(--primary); }
.pub-admin-link { font-size: .78rem; font-weight: 700; background: var(--primary); color: #fff; padding: 6px 14px; border-radius: var(--radius-md); transition: background var(--transition); }
.pub-admin-link:hover { background: var(--primary-hover); }

/* Layout */
.pub-main    { max-width: 1200px; margin: 0 auto; padding: 32px 24px; }
.pub-head    { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 8px; }
.pub-title   { font-size: 1.5rem; font-weight: 800; }
.pub-count   { font-size: .82rem; color: var(--text-muted); }
.pub-search  { margin-bottom: 24px; }
.pub-content { display: flex; gap: 24px; align-items: flex-start; }
.pub-aside   { width: 200px; flex-shrink: 0; }
.pub-grid-wrap { flex: 1; min-width: 0; }
.pub-grid    { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
.pub-empty   { text-align: center; padding: 60px 20px; color: var(--text-muted); font-size: 1.1rem; }

/* EventCard */
.event-card { background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; display: flex; flex-direction: column; transition: box-shadow var(--transition), transform var(--transition); }
.event-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,.08); transform: translateY(-2px); }
.card-media { position: relative; height: 120px; }
.image-placeholder { width: 100%; height: 100%; }
.category-badge { position: absolute; top: 10px; left: 10px; background: rgba(255,255,255,.9); backdrop-filter: blur(4px); border-radius: 20px; padding: 3px 10px; font-size: .72rem; font-weight: 700; }
.card-body { padding: 14px 16px; flex: 1; display: flex; flex-direction: column; gap: 6px; }
.date { font-size: .75rem; color: var(--text-muted); }
.card-title { font-size: .95rem; font-weight: 700; line-height: 1.3; }
.card-description { font-size: .8rem; color: var(--text-secondary); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.card-footer { padding: 10px 16px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
.price { font-weight: 800; color: var(--primary); font-size: .9rem; }
.card-actions { display: flex; align-items: center; gap: 8px; }
.btn-like { background: none; border: 1px solid var(--border-strong); border-radius: 20px; padding: 4px 10px; cursor: pointer; font-size: .8rem; display: flex; align-items: center; gap: 4px; color: var(--text-secondary); transition: all var(--transition); }
.btn-like:hover, .btn-like.active { border-color: #e11d48; color: #e11d48; background: #fff0f3; }

/* SearchBar */
.searchbar { display: flex; align-items: center; gap: 12px; background: var(--bg-surface); border: 1px solid var(--border-strong); border-radius: var(--radius-lg); padding: 8px 14px; }
.searchbar input { flex: 1; border: none; outline: none; font-size: .9rem; background: transparent; color: var(--text-primary); }
.searchbar input::placeholder { color: var(--text-muted); }
.category-select select { border: none; outline: none; background: transparent; font-size: .85rem; color: var(--text-secondary); cursor: pointer; }

/* Filters */
.filters { background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 16px; }
.filters h3 { font-size: .8rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--text-muted); margin-bottom: 14px; }
.filter-section { margin-bottom: 14px; }
.filter-label { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--text-secondary); margin-bottom: 8px; }
.filter-item label { display: flex; align-items: center; gap: 8px; font-size: .84rem; color: var(--text-secondary); cursor: pointer; padding: 4px 0; }
.filter-item input[type=checkbox] { accent-color: var(--primary); }

@media (max-width: 768px) {
  .pub-content { flex-direction: column; }
  .pub-aside   { width: 100%; }
  .pub-grid    { grid-template-columns: 1fr; }
}
</style>