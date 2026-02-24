<template>
  <article class="event-card">
    <!-- Media -->
    <div class="card-media">
      <div class="category-badge">{{ event.category }}</div>
      <div class="image-placeholder" :style="{ background: categoryGradient }"></div>
    </div>

    <!-- Body -->
    <div class="card-body">
      <p class="date">📅 {{ formatDate(event.date) }} · 📍 {{ event.location }}</p>
      <h2 class="card-title">{{ event.title }}</h2>
      <p class="card-description">{{ event.description }}</p>

      <div class="card-meta">
        <span class="attendees">👥 {{ event.attendees }} asistentes</span>
      </div>
    </div>

    <!-- Footer -->
    <div class="card-footer">
      <span class="price">{{ event.price === 0 ? 'Gratis' : `$${event.price.toLocaleString('es-CO')}` }}</span>

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
        <button class="btn btn-primary">Ver más →</button>
      </div>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({ event: { type: Object, required: true } })

const liked = ref(false)
const likeCount = ref(props.event.attendees ?? 0)

function toggleLike() {
  liked.value = !liked.value
  likeCount.value += liked.value ? 1 : -1
  // TODO: llamar al backend aquí cuando esté listo
  // await $fetch(`/api/events/${props.event.id}/like`, { method: 'POST' })
}

const gradients = {
  'Música':      'linear-gradient(135deg, #f97316, #fb923c)',
  'Tecnología':  'linear-gradient(135deg, #6366f1, #818cf8)',
  'Arte':        'linear-gradient(135deg, #ec4899, #f472b6)',
  'Deporte':     'linear-gradient(135deg, #10b981, #34d399)',
  'Gastronomía': 'linear-gradient(135deg, #f59e0b, #fbbf24)',
}

const categoryGradient = computed(() => gradients[props.event.category] || 'linear-gradient(135deg, #6366f1, #a78bfa)')

function formatDate(d) {
  try { return new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) }
  catch(e) { return d }
}
</script>