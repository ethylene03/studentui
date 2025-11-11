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
  computed: {
    page(): number {
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
      <li class="page-item" style="cursor: pointer" :class="{ disabled: page <= 1 }">
        <a
          class="page-link text-black"
          aria-label="Previous"
          @click="$router.push({ query: { page: 1 } })"
        >
          <span aria-hidden="true">
            <i class="fas fa-angles-left"></i>
          </span>
        </a>
      </li>
      <li class="page-item" style="cursor: pointer" :class="{ disabled: page <= 1 }">
        <a
          class="page-link text-black"
          aria-label="Previous"
          @click="$router.push({ query: { page: page - 1 } })"
        >
          <span aria-hidden="true">
            <i class="fas fa-angle-left"></i>
          </span>
        </a>
      </li>
      <li
        v-for="n in pages"
        :key="n"
        class="page-item"
        style="cursor: pointer"
        :class="{ disabled: n === page }"
      >
        <a class="page-link text-black" @click="$router.push({ query: { page: n } })">{{ n }}</a>
      </li>
      <li class="page-item" style="cursor: pointer" :class="{ disabled: page >= pages }">
        <a
          class="page-link text-black"
          aria-label="Next"
          @click="$router.push({ query: { page: page + 1 } })"
        >
          <span aria-hidden="true">
            <i class="fas fa-angle-right"></i>
          </span>
        </a>
      </li>
      <li class="page-item" style="cursor: pointer" :class="{ disabled: page >= pages }">
        <a
          class="page-link text-black"
          aria-label="Next"
          @click="$router.push({ query: { page: pages } })"
        >
          <span aria-hidden="true">
            <i class="fas fa-angles-right"></i>
          </span>
        </a>
      </li>
    </ul>
  </nav>
</template>
