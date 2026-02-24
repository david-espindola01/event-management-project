<template>
  <div>
    <div class="section-header">
      <h1 class="section-title">Ranking de interés</h1>
    </div>

    <div class="card">
      <div class="table-scroll">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Posición</th>
              <th>Nombre del Evento</th>
              <th>Número de Me Interesa</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="ranking.length === 0">
              <td colspan="3">
                <div class="empty-state">
                  <div class="empty-state-icon">📊</div>
                  <div class="empty-state-text">No hay datos de interés registrados.</div>
                </div>
              </td>
            </tr>
            <tr v-for="(event, index) in ranking" :key="event.id" :class="{ 'row-top': index < 3 }">
              <td class="td-position">
                <span class="position-badge" :class="`pos-${index + 1}`">{{ index + 1 }}</span>
              </td>
              <td>
                <span class="event-name">{{ event.name }}</span>
              </td>
              <td class="td-count">
                <span class="interest-count">{{ (event.interestCount ?? 0).toLocaleString('es-CO') }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { interestRanking } = useEvents()

// Only visible events, sorted descending by interest (RF-002.2)
const ranking = computed(() => interestRanking.value)
</script>

<style scoped>
.table-scroll { overflow-x:auto; }

.td-position { text-align:center; }
.position-badge {
  display:inline-flex; align-items:center; justify-content:center;
  width:28px; height:28px; border-radius:var(--radius-md);
  font-family:var(--font-display); font-size:.78rem; font-weight:700;
  background:var(--bg-elevated); border:1px solid var(--border); color:var(--text-muted);
}
.pos-1 { background:var(--primary);       color:#fff; border-color:var(--primary); }
.pos-2 { background:var(--primary-light); color:#fff; border-color:var(--primary-light); }
.pos-3 { background:var(--primary-pale);  color:var(--primary); border-color:var(--border-strong); }

.row-top td { background:rgba(52,101,109,.03); }
.row-top:hover td { background:rgba(52,101,109,.07) !important; }

.event-name { font-family:var(--font-display); font-weight:600; font-size:.9rem; }

.td-count { text-align:center; }
.interest-count { font-family:var(--font-display); font-weight:800; font-size:1.1rem; color:var(--primary); }
</style>
