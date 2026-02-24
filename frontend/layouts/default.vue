<template>
  <div>
    <header class="site-header">
      <div class="container header-inner">
        <h1 class="logo">Tu Evento Hoy</h1>
        <nav class="nav">
          <a href="#">Inicio</a>
          <a href="#">Catálogo</a>
        </nav>
      </div>
    </header>

    <main class="site-main">
      <slot />
    </main>

    <footer class="site-footer">
      <div class="container">Proyecto - Software II</div>
    </footer>
  </div>
</template>
