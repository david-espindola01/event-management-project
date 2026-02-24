<template>
  <div>
    <div class="section-header">
      <h1 class="section-title">Eventos</h1>
      <AppButtonAdmin variant="primary" @click="openModal('create')">
        <template #icon>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </template>
        Nuevo evento
      </AppButtonAdmin>
    </div>

    <div class="filters">
      <div class="search-box">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="search-icon">
          <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
          <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <input v-model="searchQuery" placeholder="Buscar por nombre…" class="search-input"/>
      </div>
      <select v-model="categoryFilter" class="select-filter">
        <option value="">Todas las categorías</option>
        <option v-for="cat in activeCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>
    </div>

    <div class="card">
      <div class="table-scroll">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Valor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredEvents.length === 0">
              <td colspan="4">
                <div class="empty-state">
                  <div class="empty-state-icon">📋</div>
                  <div class="empty-state-text">No hay eventos visibles.</div>
                </div>
              </td>
            </tr>
            <tr v-for="event in filteredEvents" :key="event.id">
              <td><span class="event-name">{{ event.name }}</span></td>
              <td><span class="category-chip">{{ getCategoryName(event.categoryId) }}</span></td>
              <td class="td-secondary">{{ event.price === 0 ? 'Gratuito' : `$${event.price.toLocaleString('es-CO')}` }}</td>
              <td>
                <div class="actions">
                  <AppButtonAdmin variant="ghost" size="sm" icon-only @click="openModal('edit', event)" title="Editar">
                    <template #icon>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                      </svg>
                    </template>
                  </AppButtonAdmin>
                  <AppButtonAdmin variant="danger" size="sm" icon-only @click="confirmDeactivate(event)" title="Inactivar">
                    <template #icon>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                      </svg>
                    </template>
                  </AppButtonAdmin>
                  <AppButtonAdmin v-if="event._originalVersion" variant="ghost" size="sm" icon-only @click="openHistory(event)" title="Ver versión original">
                    <template #icon>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M3 12a9 9 0 109 9M3 12V6M3 12H9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
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
          <div class="modal-box">
            <div class="modal-header">
              <h2 class="modal-title">{{ mode === 'create' ? 'Nuevo evento' : 'Editar evento' }}</h2>
              <button class="modal-close" @click="closeModal">✕</button>
            </div>
            <div class="modal-body">
              <AppInputAdmin v-model="form.name"        label="Nombre"      placeholder="Nombre del evento"                              :error="formErrors.name"        required hint="Solo letras, números y espacios — debe ser único"/>
              <AppInputAdmin v-model="form.categoryId"  label="Categoría"   as="select" placeholder="Selecciona una categoría"           :error="formErrors.categoryId"  required>
                <option v-for="cat in activeCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </AppInputAdmin>
              <AppInputAdmin v-model="form.price"       label="Valor"       type="number" placeholder="0" :min="0"                       :error="formErrors.price"       required helper="Ingresa 0 para eventos gratuitos">
                <template #prefix>$</template>
              </AppInputAdmin>
              <AppInputAdmin v-model="form.description" label="Descripción" as="textarea" placeholder="Describe el evento (mínimo 20 caracteres)…" :error="formErrors.description" required :maxlength="1000"/>
              <AppInputAdmin v-model="form.location"    label="Ubicación"   placeholder="Dirección o nombre del lugar"                  :error="formErrors.location"    required/>
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

    <!-- MODAL CONFIRM DEACTIVATE -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="confirmOpen" class="modal-overlay" @click.self="confirmOpen = false">
          <div class="modal-box" style="max-width:420px">
            <div class="modal-header">
              <h2 class="modal-title">Inactivar evento</h2>
              <button class="modal-close" @click="confirmOpen = false">✕</button>
            </div>
            <div class="modal-body">
              <p class="confirm-text">
                ¿Confirmas inactivar <strong>«{{ deactivateTarget?.name }}»</strong>?
              </p>
              <p class="confirm-sub">El evento dejará de ser visible. Los datos se conservan en la base de datos.</p>
            </div>
            <div class="modal-footer">
              <AppButtonAdmin variant="secondary" @click="confirmOpen = false">Cancelar</AppButtonAdmin>
              <AppButtonAdmin variant="danger" @click="doDeactivate">Inactivar</AppButtonAdmin>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MODAL HISTORY -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="historyOpen" class="modal-overlay" @click.self="historyOpen = false">
          <div class="modal-box" style="max-width:460px">
            <div class="modal-header">
              <h2 class="modal-title">Versión original</h2>
              <button class="modal-close" @click="historyOpen = false">✕</button>
            </div>
            <div class="modal-body" v-if="historyTarget">
              <p class="confirm-sub">Datos del evento antes del último cambio:</p>
              <div class="history-grid">
                <div class="h-row"><span class="h-key">Nombre</span><span class="h-val">{{ historyTarget._originalVersion?.name }}</span></div>
                <div class="h-row"><span class="h-key">Valor</span><span class="h-val">${{ historyTarget._originalVersion?.price?.toLocaleString('es-CO') }}</span></div>
                <div class="h-row"><span class="h-key">Descripción</span><span class="h-val">{{ historyTarget._originalVersion?.description }}</span></div>
                <div class="h-row"><span class="h-key">Ubicación</span><span class="h-val">{{ historyTarget._originalVersion?.location }}</span></div>
              </div>
            </div>
            <div class="modal-footer">
              <AppButtonAdmin variant="secondary" @click="historyOpen = false">Cerrar</AppButtonAdmin>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { Event, EventForm, EventFormErrors } from '~/composables/useEvents'
definePageMeta({ layout: 'admin' })

const { visibleEvents, createEvent, updateEvent, toggleStatus } = useEvents()
const { activeCategories } = useCategories()

const searchQuery    = ref('')
const categoryFilter = ref('')

// Only show visible events — RF-001.4
const filteredEvents = computed(() =>
  visibleEvents.value.filter(e =>
    e.name.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
    (!categoryFilter.value || e.categoryId === categoryFilter.value)
  )
)

function getCategoryName(id: string): string {
  const { categories } = useCategories()
  return categories.value.find(c => c.id === id)?.name ?? '—'
}

const modalOpen  = ref(false)
const mode       = ref<'create' | 'edit'>('create')
const editing    = ref<Event | null>(null)
const saving     = ref(false)
const formErrors = ref<EventFormErrors>({})
const emptyForm  = (): EventForm => ({ name: '', categoryId: '', price: '0', description: '', location: '' })
const form       = ref<EventForm>(emptyForm())

function openModal(m: 'create' | 'edit', event?: Event) {
  mode.value = m
  formErrors.value = {}
  if (m === 'edit' && event) {
    editing.value = event
    form.value = { name: event.name, categoryId: event.categoryId, price: String(event.price), description: event.description, location: event.location }
  } else {
    editing.value = null
    form.value = emptyForm()
  }
  modalOpen.value = true
}
function closeModal() { modalOpen.value = false; formErrors.value = {} }

async function save() {
  saving.value = true
  await new Promise(r => setTimeout(r, 350))
  const result = mode.value === 'create'
    ? createEvent(form.value)
    : updateEvent(editing.value!.id, form.value)
  if (result.success) closeModal()
  else formErrors.value = result.errors ?? {}
  saving.value = false
}

const confirmOpen      = ref(false)
const deactivateTarget = ref<Event | null>(null)
function confirmDeactivate(event: Event) { deactivateTarget.value = event; confirmOpen.value = true }
function doDeactivate() { if (deactivateTarget.value) toggleStatus(deactivateTarget.value.id); confirmOpen.value = false }

const historyOpen   = ref(false)
const historyTarget = ref<Event | null>(null)
function openHistory(event: Event) { historyTarget.value = event; historyOpen.value = true }
</script>

<style scoped>
.filters { display:flex; gap:10px; margin-bottom:16px; flex-wrap:wrap; }
.search-box { flex:1; min-width:200px; position:relative; display:flex; align-items:center; }
.search-icon { position:absolute; left:11px; color:var(--text-muted); pointer-events:none; }
.search-input { width:100%; background:var(--bg-surface); border:1px solid var(--border-strong); border-radius:var(--radius-md); color:var(--text-primary); font-family:var(--font-mono); font-size:.875rem; padding:9px 13px 9px 34px; outline:none; transition:border-color var(--transition),box-shadow var(--transition); }
.search-input::placeholder { color:var(--text-muted); }
.search-input:focus { border-color:var(--primary); box-shadow:0 0 0 3px rgba(52,101,109,.1); }
.select-filter { background:var(--bg-surface); border:1px solid var(--border-strong); border-radius:var(--radius-md); color:var(--text-primary); font-family:var(--font-mono); font-size:.875rem; padding:9px 32px 9px 12px; outline:none; cursor:pointer; appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%239ca3af' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 9px center; }
.select-filter:focus { border-color:var(--primary); }
.select-filter option { background:var(--bg-surface); }
.table-scroll { overflow-x:auto; }
.event-name { font-family:var(--font-display); font-weight:600; font-size:.9rem; }
.category-chip { display:inline-block; padding:2px 10px; background:var(--primary-pale); color:var(--primary); border:1px solid var(--border-strong); border-radius:999px; font-size:.72rem; font-family:var(--font-display); font-weight:600; white-space:nowrap; }
.td-secondary { font-size:.85rem; color:var(--text-secondary); }
.actions { display:flex; gap:5px; align-items:center; justify-content:center; }
.confirm-text { font-family:var(--font-display); font-size:.92rem; color:var(--text-primary); line-height:1.5; }
.confirm-text strong { color:var(--danger); }
.confirm-sub { font-size:.8rem; color:var(--text-muted); }
.history-grid { border:1px solid var(--border); border-radius:var(--radius-md); overflow:hidden; margin-top:8px; }
.h-row { display:flex; border-bottom:1px solid var(--border); }
.h-row:last-child { border-bottom:none; }
.h-key { width:100px; flex-shrink:0; padding:9px 13px; font-family:var(--font-display); font-size:.68rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:var(--text-muted); background:var(--bg-elevated); border-right:1px solid var(--border); }
.h-val { padding:9px 13px; font-size:.85rem; color:var(--text-primary); }
.modal-enter-active,.modal-leave-active { transition:opacity 180ms ease; }
.modal-enter-from,.modal-leave-to { opacity:0; }
</style>
