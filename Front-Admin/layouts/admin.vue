<template>
  <div class="shell">

    <aside class="sidebar" :class="{ 'mobile-open': mobileOpen }">
      <div class="brand">
        <div class="brand-logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
            <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <span class="brand-name">Eventos Admin</span>
      </div>

      <nav class="nav">
        <NuxtLink to="/admin/events"     class="nav-item" @click="closeMobile">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
            <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>Eventos</span>
        </NuxtLink>

        <NuxtLink to="/admin/categories" class="nav-item" @click="closeMobile">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          </svg>
          <span>Categorías</span>
        </NuxtLink>

        <NuxtLink to="/admin/reports"    class="nav-item" @click="closeMobile">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>Reportes</span>
        </NuxtLink>
      </nav>

      <div class="sidebar-footer">
        <div class="user-chip">
          <div class="avatar">A</div>
          <div class="user-info">
            <span class="user-name">Administrador</span>
            <span class="user-role">Panel de Control</span>
          </div>
        </div>
      </div>
    </aside>

    <div v-if="mobileOpen" class="backdrop" @click="closeMobile"></div>

    <div class="main">
      <header class="topbar">
        <button class="hamburger" @click="mobileOpen = !mobileOpen" aria-label="Menú">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <span class="topbar-title">{{ pageTitle }}</span>
      </header>

      <main class="content">
        <slot />
      </main>
    </div>

  </div>
</template>

<script setup lang="ts">
const route     = useRoute()
const mobileOpen = ref(false)

const titles: Record<string, string> = {
  '/admin/events':     'Eventos',
  '/admin/categories': 'Categorías',
  '/admin/reports':    'Reportes',
}
const pageTitle = computed(() => titles[route.path] ?? 'Admin')

function closeMobile() { mobileOpen.value = false }
watch(() => route.path, () => { mobileOpen.value = false })
</script>

<style scoped>
.shell { display:flex; min-height:100vh; }

/* ── Sidebar ── */
.sidebar {
  width:var(--sidebar-w);
  min-height:100vh;
  background:var(--primary);
  display:flex;
  flex-direction:column;
  flex-shrink:0;
  position:sticky;
  top:0;
  height:100vh;
  overflow-y:auto;
  z-index:40;
}

.brand { height:64px; padding:0 20px; display:flex; align-items:center; gap:10px; border-bottom:1px solid rgba(255,255,255,.12); }
.brand-logo { width:34px; height:34px; background:rgba(255,255,255,.15); border-radius:var(--radius-md); display:grid; place-items:center; color:#fff; flex-shrink:0; }
.brand-name { font-family:var(--font-display); font-weight:800; font-size:1rem; color:#fff; }

.nav { flex:1; padding:16px 10px; display:flex; flex-direction:column; gap:3px; }
.nav-item { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:var(--radius-md); color:rgba(255,255,255,.72); text-decoration:none; font-family:var(--font-display); font-size:.875rem; font-weight:600; transition:background var(--transition), color var(--transition); }
.nav-item:hover { background:rgba(255,255,255,.1); color:#fff; }
.nav-item.router-link-active { background:rgba(255,255,255,.18); color:#fff; }
.nav-item svg { flex-shrink:0; }

.sidebar-footer { padding:14px 12px; border-top:1px solid rgba(255,255,255,.12); }
.user-chip { display:flex; align-items:center; gap:10px; padding:10px; background:rgba(255,255,255,.1); border-radius:var(--radius-md); }
.avatar { width:30px; height:30px; background:rgba(255,255,255,.25); border-radius:var(--radius-sm); display:grid; place-items:center; font-family:var(--font-display); font-weight:800; color:#fff; font-size:.82rem; flex-shrink:0; }
.user-info { display:flex; flex-direction:column; line-height:1.2; }
.user-name { font-family:var(--font-display); font-size:.78rem; font-weight:700; color:#fff; }
.user-role { font-size:.62rem; color:rgba(255,255,255,.55); }

/* ── Main ── */
.main { flex:1; display:flex; flex-direction:column; min-width:0; }

.topbar { display:none; height:56px; background:var(--bg-surface); border-bottom:1px solid var(--border); align-items:center; gap:14px; padding:0 20px; position:sticky; top:0; z-index:30; }
.topbar-title { font-family:var(--font-display); font-weight:700; font-size:.95rem; color:var(--text-primary); }
.hamburger { background:none; border:none; color:var(--text-secondary); cursor:pointer; display:grid; place-items:center; padding:4px; border-radius:var(--radius-sm); }
.hamburger:hover { background:var(--bg-elevated); color:var(--primary); }

.content { flex:1; padding:32px 28px; max-width:1100px; width:100%; }

.backdrop { display:none; position:fixed; inset:0; z-index:39; background:rgba(0,0,0,.35); }

/* ── Responsive ── */
@media (max-width:768px) {
  .sidebar { position:fixed; left:-260px; top:0; bottom:0; height:100%; transition:left var(--transition-slow); }
  .sidebar.mobile-open { left:0; }
  .backdrop { display:block; }
  .topbar { display:flex; }
  .content { padding:20px 16px; }
}
</style>
