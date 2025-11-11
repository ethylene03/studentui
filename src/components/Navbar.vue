<script lang="ts">
import { logout } from '@/api/authorization'
import { useAuthorizationStore } from '@/stores/authorization'

export default {
  name: 'Navbar',
  data() {
    return {}
  },
  methods: {
    async logoutUser() {
      await logout()

      const auth = useAuthorizationStore()
      auth.clearToken()
      window.location.reload()
    },
  },
  computed: {
    currentPath(): string {
      return this.$route.path.split('/')[1] || 'home'
    },
  },
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light p-3">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Student Management System</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a
              id="students"
              class="nav-link"
              :class="{ active: currentPath === 'students' }"
              href="/students"
              >Students</a
            >
          </li>
          <li class="nav-item">
            <a
              id="courses"
              class="nav-link"
              :class="{ active: currentPath === 'courses' }"
              href="/courses"
              >Courses</a
            >
          </li>
          <li class="border-start ps-4 nav-item">
            <a class="nav-link" href="#" @click.prevent="logoutUser">
              <i class="fas fa-right-from-bracket me-1"></i>
              Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
@media screen and (max-width: 576px) {
  .navbar-brand {
    font-size: medium;
  }
}
</style>
