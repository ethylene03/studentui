<script setup lang="ts">
import { logout } from '@/helpers/api/authorization'
import { useAuthorizationStore } from '@/helpers/stores/authorization'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Toast } from 'bootstrap'
import SuccessToast from './SuccessToast.vue'

const router = useRouter()
const route = useRoute()

async function logoutUser() {
  await logout()

  const auth = useAuthorizationStore()
  auth.clearToken()

  const toast = document.getElementById('toast--logout')
  const toastInstance = new Toast(toast as HTMLElement)
  toastInstance.show()

  setTimeout(() => {
    router.push('/')
  }, 500)
}

const currentPath = computed((): string => {
  return route.path.split('/')[1] || 'home'
})

const isOpen = ref<boolean>(false)
</script>

<template>
  <nav class="navbar navbar-expand-lg sticky-top bg-light p-3 py-4">
    <div class="container-fluid">
      <a class="navbar-brand cursor-pointer" @click="$router.push('/students')">
        Student Management System
      </a>
      <button
        class="navbar-toggler border-0"
        type="button"
        aria-label="Toggle navigation"
        @click="isOpen = !isOpen"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div :class="[{ collapse: !isOpen }, 'navbar-collapse', { show: isOpen }]" id="navbarNav">
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
            <a class="nav-link" @click="logoutUser">
              <i class="fas fa-right-from-bracket me-1"></i>
              Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
    <SuccessToast id="toast--logout" message="Logged out successfully!" />
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
