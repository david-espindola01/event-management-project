// composables/useCategories.ts

export interface Category {
  id: string
  name: string
  status: 'active' | 'inactive'
  createdAt: string
}

export interface CategoryFormErrors {
  name?: string
}

const mockCategories: Category[] = [
  { id: '1', name: 'Música y Entretenimiento',  status: 'active',   createdAt: '2024-11-01' },
  { id: '2', name: 'Literatura y Cultura',       status: 'active',   createdAt: '2024-11-01' },
  { id: '3', name: 'Deporte y Bienestar',        status: 'active',   createdAt: '2024-11-15' },
  { id: '4', name: 'Gastronomía',                status: 'active',   createdAt: '2024-12-01' },
  { id: '5', name: 'Tecnología e Innovación',    status: 'inactive', createdAt: '2024-12-10' },
]

// Reactive global state — shared between admin and public views
const categories = ref<Category[]>([...mockCategories])

export function useCategories() {
  // ── Public view: only active categories (RF-003.2) ──
  const activeCategories = computed(() =>
    categories.value.filter(c => c.status === 'active')
  )

  // ── Sorted alphabetically (RF-003.2) ──
  const sortedCategories = computed(() =>
    [...categories.value].sort((a, b) => a.name.localeCompare(b.name, 'es'))
  )

  const sortedActiveCategories = computed(() =>
    [...activeCategories.value].sort((a, b) => a.name.localeCompare(b.name, 'es'))
  )

  // ── Validate form (RF-003.1) ──
  function validateForm(name: string, excludeId?: string): CategoryFormErrors {
    const errors: CategoryFormErrors = {}
    if (!name.trim()) {
      errors.name = 'El nombre de la categoría es obligatorio.'
    } else if (name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres.'
    } else {
      const duplicate = categories.value.some(
        c => c.name.toLowerCase() === name.trim().toLowerCase() && c.id !== excludeId
      )
      if (duplicate) errors.name = 'Ya existe una categoría con ese nombre.'
    }
    return errors
  }

  // ── Create category (RF-003.1) ──
  function createCategory(name: string): { success: boolean; errors?: CategoryFormErrors } {
    const errors = validateForm(name)
    if (Object.keys(errors).length > 0) return { success: false, errors }

    categories.value.push({
      id:        Date.now().toString(),
      name:      name.trim(),
      status:    'active',
      createdAt: new Date().toISOString().split('T')[0],
    })
    return { success: true }
  }

  // ── Update category name (RF-003.3) ──
  function updateCategory(id: string, name: string): { success: boolean; errors?: CategoryFormErrors } {
    const errors = validateForm(name, id)
    if (Object.keys(errors).length > 0) return { success: false, errors }

    const category = categories.value.find(c => c.id === id)
    if (category) category.name = name.trim()
    return { success: true }
  }

  // ── Deactivate category — blocked if it has active events (RF-003.4) ──
  function deactivateCategory(id: string, activeEventNames: string[]): { success: boolean; message?: string } {
    if (activeEventNames.length > 0) {
      return {
        success: false,
        message: `No es posible inactivar esta categoría. Tiene ${activeEventNames.length} evento(s) activo(s) vinculado(s). Reasigna los eventos antes de continuar.`,
      }
    }
    const category = categories.value.find(c => c.id === id)
    if (category) category.status = 'inactive'
    return { success: true }
  }

  // ── Reactivate category ──
  function reactivateCategory(id: string): void {
    const category = categories.value.find(c => c.id === id)
    if (category) category.status = 'active'
  }

  return {
    categories:           readonly(categories),
    activeCategories,
    sortedCategories,
    sortedActiveCategories,
    validateForm,
    createCategory,
    updateCategory,
    deactivateCategory,
    reactivateCategory,
  }
}
