<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const { pages } = defineProps<{ pages: number }>()
const route = useRoute()

const currentPage = computed(() => {
  return parseInt(route.query.page as string) || 1
})

function getPagination(current: number, total: number): string[] {
  const pages: string[] = []

  if (total <= 5) for (let i = 1; i <= total; i++) pages.push(i.toString())
  else {
    pages.push('1')

    if (current > 3) pages.push('…')

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) pages.push(i.toString())

    if (current < total - 2) pages.push('…')

    pages.push(total.toString())
  }
  return pages
}
</script>

<template>
  <nav
    id="pagination"
    class="w-100 bg-white p-3 d-flex justify-content-center mb-3"
    v-if="pages > 1"
  >
    <ul class="pagination mb-0">
      <li class="page-item" style="cursor: pointer" :class="{ disabled: currentPage <= 1 }">
        <a
          class="page-link text-primary"
          aria-label="Previous"
          @click="$router.push({ query: { page: currentPage - 1 } })"
        >
          <span aria-hidden="true">
            <i class="fas fa-angle-left"></i>
          </span>
        </a>
      </li>

      <li
        v-for="n in getPagination(currentPage, pages)"
        :key="n"
        class="page-item"
        style="cursor: pointer"
        :class="{ disabled: n === currentPage.toString() || n === '…' }"
      >
        <a class="page-link text-primary" @click="$router.push({ query: { page: n } })">{{ n }}</a>
      </li>

      <li class="page-item" style="cursor: pointer" :class="{ disabled: currentPage >= pages }">
        <a
          class="page-link text-primary"
          aria-label="Next"
          @click="$router.push({ query: { page: currentPage + 1 } })"
        >
          <span aria-hidden="true">
            <i class="fas fa-angle-right"></i>
          </span>
        </a>
      </li>
    </ul>
  </nav>
</template>
