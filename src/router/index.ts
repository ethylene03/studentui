import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/views/authorization/Login.vue'
import Students from '@/views/students/Students.vue'
import Courses from '@/views/courses/Courses.vue'
import AddStudent from '@/views/students/AddStudent.vue'
import EditStudent from '@/views/students/EditStudent.vue'
import AddCourse from '@/views/courses/AddCourse.vue'
import EditCourse from '@/views/courses/EditCourse.vue'
import { useAuthorizationStore } from '@/helpers/stores/authorization'
import Signup from '@/views/authorization/Signup.vue'
import { refreshToken } from '@/helpers/api/authorization'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Login', component: Login },
    { path: '/signup', name: 'Signup', component: Signup },
    { path: '/students', name: 'Students', component: Students, meta: { requiresAuth: true } },
    {
      path: '/students/add',
      name: 'AddStudent',
      component: AddStudent,
      meta: { requiresAuth: true },
    },
    {
      path: '/students/:id/edit',
      name: 'EditStudent',
      component: EditStudent,
      meta: { requiresAuth: true },
    },
    { path: '/courses', name: 'Courses', component: Courses, meta: { requiresAuth: true } },
    { path: '/courses/add', name: 'AddCourse', component: AddCourse, meta: { requiresAuth: true } },
    {
      path: '/courses/:id/edit',
      name: 'EditCourse',
      component: EditCourse,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthorizationStore()

  if (!auth.isLoggedIn() && to.name !== 'Login') {
    const newToken = await refreshToken()
    if (newToken.token) auth.setToken(newToken.token)
  }

  if (to.meta.requiresAuth && !auth.isLoggedIn()) {
    next({ name: 'Login' })
    return
  }

  if (to.name === 'Login' && auth.isLoggedIn()) {
    next({ name: 'Students' })
    return
  }

  next()
})

export default router
