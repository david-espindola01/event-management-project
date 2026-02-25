<template>
  <article class="event-card">
    <!-- Media -->
    <div class="card-media">
      <img v-if="event.imageUrl" :src="event.imageUrl" :alt="event.NameEvent" class="card-img" />
      <div v-else class="image-placeholder" :style="{ background: categoryGradient }"></div>
      <div class="category-badge">{{ event.nameCategory }}</div>
    </div>

    <!-- Body -->
    <div class="card-body">
      <p class="date">📅 {{ formatDate(event.date_time) }} · 📍 {{ event.location }}</p>
      <h2 class="card-title">{{ event.NameEvent }}</h2>
      <p class="card-description">{{ event.description }}</p>
    </div>

    <!-- Footer -->
    <div class="card-footer">
      <span class="price">{{ event.value === 0 ? 'Gratis' : `$${event.value.toLocaleString('es-CO')}` }}</span>
      <div class="card-actions">
        <button
          class="btn-like"
          :class="{ active: liked }"
          @click="toggleLike"
          :title="liked ? 'Ya no me interesa' : 'Me interesa'"
        >
          {{ liked ? '❤️' : '🤍' }}
          <span class="like-count">{{ likeCount }}</span>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Event } from '~/composables/useEvents'

const props = defineProps<{ event: Event }>()

const { registerInterest, removeInterest, getInterestStatus } = useEvents()

const liked    = ref(false)
const likeCount = ref(0)

onMounted(async () => {
  const status = await getInterestStatus(props.event.id_event)
  liked.value    = status.interested
  likeCount.value = status.total_interests
})

async function toggleLike() {
  if (liked.value) {
    const r = await removeInterest(props.event.id_event)
    if (r.success) { liked.value = false; likeCount.value = r.total_interests ?? likeCount.value - 1 }
  } else {
    const r = await registerInterest(props.event.id_event)
    if (r.success) { liked.value = true; likeCount.value = r.total_interests ?? likeCount.value + 1 }
  }
}

const gradients: Record<string, string> = {
  'Música y Entretenimiento': 'linear-gradient(135deg, #f97316, #fb923c)',
  'Tecnología e Innovación':  'linear-gradient(135deg, #6366f1, #818cf8)',
  'Literatura y Cultura':     'linear-gradient(135deg, #ec4899, #f472b6)',
  'Deporte y Bienestar':      'linear-gradient(135deg, #10b981, #34d399)',
  'Gastronomía':              'linear-gradient(135deg, #f59e0b, #fbbf24)',
}

const categoryGradient = computed(() =>
  gradients[props.event.nameCategory] ?? 'linear-gradient(135deg, #6366f1, #a78bfa)'
)

function formatDate(d: string | null) {
  if (!d) return 'Fecha por confirmar'
  try { return new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) }
  catch { return d }
}
</script>