<script lang="ts">
import { logout } from '@/helpers/api/authorization'
import { useAuthorizationStore } from '@/helpers/stores/authorization'

export default {
  name: 'Navbar',
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
  <nav class="navbar navbar-expand-lg sticky-top bg-light p-3 py-4">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Student Management System</a>
      <button
        class="navbar-toggler border-0"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="nav nav-underline ms-auto gap-5">
          <li class="nav-item">
            <a
              id="students"
              class="nav-link"
              :class="{ active: currentPath === 'students' }"
              @click="$router.push('/students')"
              style="cursor: pointer"
            >
              Students
            </a>
          </li>
          <li class="nav-item">
            <a
              id="courses"
              class="nav-link"
              :class="{ active: currentPath === 'courses' }"
              @click="$router.push('/courses')"
              style="cursor: pointer"
            >
              Courses
            </a>
          </li>
          <li class="border-start ps-4 nav-item">
            <a class="nav-link" href="#" @click="logoutUser">
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
.navbar-toggler {
  outline: none;
  box-shadow: none;
}

@media screen and (max-width: 576px) {
  .navbar-brand {
    font-size: medium;
  }
}
</style>
