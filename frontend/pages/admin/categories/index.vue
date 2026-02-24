<template>
  <div>
    <div class="section-header">
      <h1 class="section-title">Categorías</h1>
      <AppButtonAdmin variant="primary" @click="openModal('create')">
        <template #icon>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </template>
        Nueva categoría
      </AppButtonAdmin>
    </div>

    <div class="filters">
      <div class="search-box">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="search-icon">
          <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
          <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <input v-model="searchQuery" placeholder="Buscar categoría…" class="search-input"/>
      </div>
      <AppButtonAdmin variant="secondary" size="sm" @click="sortAsc = !sortAsc">
        <template #icon>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M7 12h10M11 18h2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </template>
        A–Z {{ sortAsc ? '↑' : '↓' }}
      </AppButtonAdmin>
    </div>

    <div class="card">
      <div class="table-scroll">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Eventos activos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredCategories.length === 0">
              <td colspan="3">
                <div class="empty-state">
                  <div class="empty-state-icon">🏷️</div>
                  <div class="empty-state-text">No hay categorías activas.</div>
                </div>
              </td>
            </tr>
            <tr v-for="cat in filteredCategories" :key="cat.id">
              <td>
                <div class="cat-name-cell">
                  <div class="cat-bar"></div>
                  <span class="cat-name">{{ cat.name }}</span>
                </div>
              </td>
              <td class="td-secondary">{{ countActiveEvents(cat.id) }}</td>
              <td>
                <div class="actions">
                  <AppButtonAdmin variant="ghost" size="sm" icon-only @click="openModal('edit', cat)" title="Editar">
                    <template #icon>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                      </svg>
                    </template>
                  </AppButtonAdmin>
                  <AppButtonAdmin variant="danger" size="sm" icon-only @click="tryDeactivate(cat)" title="Inactivar">
                    <template #icon>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/>
                        <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                      </svg>
                    </template>
                  </AppButtonAdmin>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL CREATE / EDIT -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="modalOpen" class="modal-overlay" @click.self="closeModal">
          <div class="modal-box" style="max-width:440px">
            <div class="modal-header">
              <h2 class="modal-title">{{ mode === 'create' ? 'Nueva categoría' : 'Editar categoría' }}</h2>
              <button class="modal-close" @click="closeModal">✕</button>
            </div>
            <div class="modal-body">
              <AppInputAdmin v-model="formName" label="Nombre" placeholder="Nombre de la categoría" :error="formError" required helper="Debe ser único y no puede quedar vacío"/>
            </div>
            <div class="modal-footer">
              <AppButtonAdmin variant="secondary" @click="closeModal">Cancelar</AppButtonAdmin>
              <AppButtonAdmin variant="primary" :loading="saving" @click="save">
                {{ mode === 'create' ? 'Guardar' : 'Actualizar' }}
              </AppButtonAdmin>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MODAL DEACTIVATE ERROR (RF-003.4) -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="deactivateErrorOpen" class="modal-overlay" @click.self="deactivateErrorOpen = false">
          <div class="modal-box" style="max-width:440px">
            <div class="modal-header">
              <h2 class="modal-title" style="color:var(--danger)">No es posible inactivar</h2>
              <button class="modal-close" @click="deactivateErrorOpen = false">✕</button>
            </div>
            <div class="modal-body">
              <p class="error-message">{{ deactivateErrorMsg }}</p>
              <div class="blocked-list">
                <p class="blocked-title">Eventos activos vinculados:</p>
                <ul>
                  <li v-for="name in blockedEventNames" :key="name" class="blocked-item">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    {{ name }}
                  </li>
                </ul>
              </div>
            </div>
            <div class="modal-footer">
              <AppButtonAdmin variant="secondary" @click="deactivateErrorOpen = false">Entendido</AppButtonAdmin>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/composables/useCategories'
definePageMeta({ layout: 'admin' })

const { sortedActiveCategories, createCategory, updateCategory, deactivateCategory } = useCategories()
const { events } = useEvents()

const searchQuery = ref('')
const sortAsc     = ref(true)

// Only active categories — RF-003.2
const filteredCategories = computed(() => {
  const list = sortAsc.value
    ? [...sortedActiveCategories.value]
    : [...sortedActiveCategories.value].reverse()
  if (!searchQuery.value) return list
  return list.filter(c => c.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

function countActiveEvents(categoryId: string): number {
  return events.value.filter(e => e.categoryId === categoryId && e.status === 'visible').length
}

const modalOpen = ref(false)
const mode      = ref<'create' | 'edit'>('create')
const editing   = ref<Category | null>(null)
const formName  = ref('')
const formError = ref('')
const saving    = ref(false)

function openModal(m: 'create' | 'edit', cat?: Category) {
  mode.value = m
  formError.value = ''
  formName.value = m === 'edit' && cat ? cat.name : ''
  editing.value = cat ?? null
  modalOpen.value = true
}
function closeModal() { modalOpen.value = false; formError.value = '' }

async function save() {
  saving.value = true
  await new Promise(r => setTimeout(r, 300))
  const result = mode.value === 'create'
    ? createCategory(formName.value)
    : updateCategory(editing.value!.id, formName.value)
  if (result.success) closeModal()
  else formError.value = result.errors?.name ?? 'Error desconocido.'
  saving.value = false
}

const deactivateErrorOpen = ref(false)
const deactivateErrorMsg  = ref('')
const blockedEventNames   = ref<string[]>([])

function tryDeactivate(cat: Category) {
  const activeEventNames = events.value
    .filter(e => e.categoryId === cat.id && e.status === 'visible')
    .map(e => e.name)
  const result = deactivateCategory(cat.id, activeEventNames)
  if (!result.success) {
    deactivateErrorMsg.value  = result.message ?? ''
    blockedEventNames.value   = activeEventNames
    deactivateErrorOpen.value = true
  }
}
</script>

<style scoped>
.filters { display:flex; gap:10px; margin-bottom:16px; flex-wrap:wrap; align-items:center; }
.search-box { flex:1; min-width:200px; position:relative; display:flex; align-items:center; }
.search-icon { position:absolute; left:11px; color:var(--text-muted); pointer-events:none; }
.search-input { width:100%; background:var(--bg-surface); border:1px solid var(--border-strong); border-radius:var(--radius-md); color:var(--text-primary); font-family:var(--font-mono); font-size:.875rem; padding:9px 13px 9px 34px; outline:none; transition:border-color var(--transition),box-shadow var(--transition); }
.search-input::placeholder { color:var(--text-muted); }
.search-input:focus { border-color:var(--primary); box-shadow:0 0 0 3px rgba(52,101,109,.1); }
.table-scroll { overflow-x:auto; }
.cat-name-cell { display:flex; align-items:center; gap:10px; }
.cat-bar { width:3px; height:22px; background:var(--primary-light); border-radius:2px; flex-shrink:0; }
.cat-name { font-family:var(--font-display); font-weight:600; font-size:.9rem; }
.td-secondary { font-size:.85rem; color:var(--text-secondary); }
.actions { display:flex; gap:5px; justify-content:center; }
.error-message { font-size:.85rem; color:var(--text-secondary); line-height:1.5; }
.blocked-list { margin-top:10px; padding:12px 14px; background:var(--bg-elevated); border:1px solid var(--border); border-radius:var(--radius-md); }
.blocked-title { font-family:var(--font-display); font-size:.68rem; text-transform:uppercase; letter-spacing:.07em; color:var(--text-muted); margin-bottom:7px; font-weight:700; }
.blocked-item { display:flex; align-items:center; gap:7px; font-size:.82rem; color:var(--danger); padding:3px 0; }
.modal-enter-active,.modal-leave-active { transition:opacity 180ms ease; }
.modal-enter-from,.modal-leave-to { opacity:0; }
</style>
