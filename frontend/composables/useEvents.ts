// composables/useEvents.ts

import { ref, computed, readonly } from 'vue'

export interface Event {
  id: string
  name: string
  categoryId: string
  price: number
  description: string
  location: string
  status: 'visible' | 'hidden'
  createdAt: string
  _originalVersion?: Partial<Event>
  interestCount?: number
}

export interface EventForm {
  name: string
  categoryId: string
  price: string
  description: string
  location: string
}

export interface EventFormErrors {
  name?: string
  categoryId?: string
  price?: string
  description?: string
  location?: string
}

const mockEvents: Event[] = [
  { id: '1', name: 'Festival de Jazz Boyacá 2025',    categoryId: '1', price: 45000, description: 'Disfruta de los mejores artistas de jazz nacional e internacional en el corazón de Boyacá.', location: 'Parque Principal, Tunja',    status: 'visible', createdAt: '2025-01-10', interestCount: 142 },
  { id: '2', name: 'Feria del Libro Tunja',           categoryId: '2', price: 0,     description: 'Evento literario con más de 200 expositores, conferencias y talleres para todos los públicos.', location: 'Centro Cultural, Tunja',  status: 'visible', createdAt: '2025-01-18', interestCount: 98  },
  { id: '3', name: 'Maratón Ciudad Verde',            categoryId: '3', price: 30000, description: 'Carrera atlética de 21km por los principales parques y avenidas de la ciudad.',               location: 'Av. Universitaria, Tunja', status: 'visible', createdAt: '2025-01-22', interestCount: 215 },
  { id: '4', name: 'Expo Gastronomía Campesina',      categoryId: '4', price: 15000, description: 'Muestra de la riqueza culinaria del departamento con chefs locales y degustaciones incluidas.', location: 'Plaza de Bolívar, Tunja',  status: 'hidden',  createdAt: '2025-02-01', interestCount: 67  },
  { id: '5', name: 'Concierto Sinfónico Nocturno',   categoryId: '1', price: 25000, description: 'La orquesta filarmónica de Boyacá presenta su programa de gala bajo las estrellas.',            location: 'Anfiteatro Municipal',      status: 'visible', createdAt: '2025-02-05', interestCount: 189 },
]

// Reactive global state — shared between admin and public views
const events = ref<Event[]>([...mockEvents])

export function useEvents() {
  // ── Public view: only visible events (RF-001.2, RF-001.4) ──
  const visibleEvents = computed(() =>
    events.value.filter(e => e.status === 'visible')
  )

  // ── Ranking for reports, descending by interest (RF-002.2) ──
  const interestRanking = computed(() =>
    [...visibleEvents.value].sort((a, b) => (b.interestCount ?? 0) - (a.interestCount ?? 0))
  )

  // ── Validate name: alphanumeric, unique (RF-001.1) ──
  function isNameUnique(name: string, excludeId?: string): boolean {
    return !events.value.some(
      e => e.name.toLowerCase() === name.trim().toLowerCase() && e.id !== excludeId
    )
  }

  // ── Validate form (RF-001.1) ──
  function validateForm(form: EventForm, excludeId?: string): EventFormErrors {
    const errors: EventFormErrors = {}
    const alphanumeric = /^[a-zA-Z0-9ÁÉÍÓÚáéíóúÑñüÜ\s]+$/

    if (!form.name.trim()) {
      errors.name = 'El nombre del evento es obligatorio.'
    } else if (!alphanumeric.test(form.name)) {
      errors.name = 'Solo se permiten letras, números y espacios.'
    } else if (!isNameUnique(form.name, excludeId)) {
      errors.name = 'Ya existe un evento con ese nombre. Debe ser único.'
    }

    if (!form.categoryId) {
      errors.categoryId = 'Debes seleccionar una categoría.'
    }

    if (form.price === '' || form.price === null || form.price === undefined) {
      errors.price = 'El valor es obligatorio.'
    } else if (isNaN(Number(form.price)) || Number(form.price) < 0) {
      errors.price = 'El valor debe ser un número igual o mayor a 0.'
    }

    if (!form.description.trim()) {
      errors.description = 'La descripción es obligatoria.'
    } else if (form.description.trim().length < 20) {
      errors.description = `Mínimo 20 caracteres. Faltan ${20 - form.description.trim().length}.`
    }

    if (!form.location.trim()) {
      errors.location = 'La ubicación es obligatoria.'
    }

    return errors
  }

  // ── Create event (RF-001.1) ──
  function createEvent(form: EventForm): { success: boolean; errors?: EventFormErrors } {
    const errors = validateForm(form)
    if (Object.keys(errors).length > 0) return { success: false, errors }

    events.value.unshift({
      id:           Date.now().toString(),
      name:         form.name.trim(),
      categoryId:   form.categoryId,
      price:        Number(form.price),
      description:  form.description.trim(),
      location:     form.location.trim(),
      status:       'visible',
      createdAt:    new Date().toISOString().split('T')[0],
      interestCount: 0,
    })
    return { success: true }
  }

  // ── Update event — keeps original version (RF-001.3) ──
  function updateEvent(id: string, form: EventForm): { success: boolean; errors?: EventFormErrors } {
    const errors = validateForm(form, id)
    if (Object.keys(errors).length > 0) return { success: false, errors }

    const index = events.value.findIndex(e => e.id === id)
    if (index === -1) return { success: false }

    const original = { ...events.value[index] }
    events.value[index] = {
      ...events.value[index],
      name:        form.name.trim(),
      categoryId:  form.categoryId,
      price:       Number(form.price),
      description: form.description.trim(),
      location:    form.location.trim(),
      _originalVersion: original,
    }
    return { success: true }
  }

  // ── Logical delete: visible ↔ hidden (RF-001.4) ──
  function toggleStatus(id: string): void {
    const event = events.value.find(e => e.id === id)
    if (!event) return
    event.status = event.status === 'visible' ? 'hidden' : 'visible'
  }

  // ── Register interest (RF-002.1) ──
  function registerInterest(id: string): void {
    const event = events.value.find(e => e.id === id)
    if (event) event.interestCount = (event.interestCount ?? 0) + 1
  }

  return {
    events: readonly(events),
    visibleEvents,
    interestRanking,
    validateForm,
    createEvent,
    updateEvent,
    toggleStatus,
    registerInterest,
  }
}