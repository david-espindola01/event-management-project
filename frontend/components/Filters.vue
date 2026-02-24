<template>
  <div class="filters">
    <h3>Filtros</h3>

    <div class="filter-section">
      <p class="filter-label">Precio</p>
      <div class="filter-item">
        <label>
          <input type="checkbox" v-model="filters.free" @change="emit('update:filters', filters)" />
          Gratis
        </label>
      </div>
    </div>

    <div class="filter-section">
      <p class="filter-label">Modalidad</p>
      <div class="filter-item">
        <label>
          <input type="checkbox" v-model="filters.presencial" @change="emit('update:filters', filters)" />
          Presencial
        </label>
      </div>
      <div class="filter-item">
        <label>
          <input type="checkbox" v-model="filters.online" @change="emit('update:filters', filters)" />
          En línea
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['update:filters'])

const filters = reactive({
  free: false,
  presencial: false,
  online: false
})
</script>