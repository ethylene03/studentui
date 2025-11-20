import { createRouter, createWebHistory } from 'vue-router'

import { refreshToken } from '@/helpers/api/authorization'
import { useAuthorizationStore } from '@/helpers/stores/authorization'
import LogIn from '@/views/authorization/LogIn.vue'
import SignUp from '@/views/authorization/SignUp.vue'
import AddCourse from '@/views/courses/AddCourse.vue'
import EditCourse from '@/views/courses/EditCourse.vue'
import ViewCourses from '@/views/courses/ViewCourses.vue'
import NotFound from '@/views/NotFound.vue'
import AddStudent from '@/views/students/AddStudent.vue'
import EditStudent from '@/views/students/EditStudent.vue'
import ViewStudents from '@/views/students/ViewStudents.vue'
import MyProfile from '@/views/profile/MyProfile.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Login', component: LogIn },
    { path: '/signup', name: 'Signup', component: SignUp },
    { path: '/students', name: 'Students', component: ViewStudents, meta: { requiresAuth: true } },
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
    { path: '/courses', name: 'Courses', component: ViewCourses, meta: { requiresAuth: true } },
    { path: '/courses/add', name: 'AddCourse', component: AddCourse, meta: { requiresAuth: true } },
    {
      path: '/courses/:id/edit',
      name: 'EditCourse',
      component: EditCourse,
      meta: { requiresAuth: true },
    },
    { path: '/profile', name: 'Profile', component: MyProfile, meta: { requiresAuth: true } },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthorizationStore()

  if (!auth.isLoggedIn()) {
    const newToken = await refreshToken()

    if (!newToken && to.name !== 'Login' && to.name !== 'Signup') next({ name: 'Login' })
    else if (newToken) {
      auth.setToken(newToken.token)
      auth.setUserDetails(newToken.id, newToken.username)
    }
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
