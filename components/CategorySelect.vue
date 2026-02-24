<template>
  <div class="category-select">
    <select v-model="selected" @change="onChange">
      <option value="">Todas las categorías</option>
      <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
    </select>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({ categories: { type: Array, default: () => [] } })
const emit = defineEmits(['update:category'])
const selected = ref('')
function onChange() {
  emit('update:category', selected.value)
}
watch(()=>props.categories, ()=>{ if(!props.categories.includes(selected.value)) selected.value=''})
</script>
