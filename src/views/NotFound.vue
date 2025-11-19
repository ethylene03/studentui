<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
</script>

<template>
  <section id="not-found" class="w-100 bg-white min-vh-100">
    <Navbar />
    <div class="d-flex flex-column justify-content-center align-items-center mt-5">
      <img src="../helpers/404.png" alt="page not found" style="height: 50vh" />
      <h3>Page Not Found</h3>
      <span>The requested URL was not found on this server. Try a different URL.</span>
    </div>
  </section>
</template>
