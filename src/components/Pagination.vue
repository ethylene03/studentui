<script lang="ts">
export default {
  name: 'TablePagination',
  props: {
    pages: {
      type: Number,
      default: 5,
      required: true,
    },
  },
  methods: {
    getPagination(current: number, total: number) {
      const pages: (number | string)[] = []

      if (total <= 5) for (let i = 1; i <= total; i++) pages.push(i)
      else {
        pages.push(1)

        if (current > 3) pages.push('…')

        const start = Math.max(2, current - 1)
        const end = Math.min(total - 1, current + 1)
        for (let i = start; i <= end; i++) pages.push(i)

        if (current < total - 3) pages.push('…')

        pages.push(total)
      }
      return pages
    },
  },
  computed: {
    currentPage(): number {
      const page = parseInt(this.$route.query.page as string) || 1
      return page
    },
  },
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
        :class="{ disabled: n === currentPage || n === '…' }"
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
