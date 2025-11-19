<script setup lang="ts">
const { pages, current } = defineProps<{ pages: number; current: number }>()

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

const emit = defineEmits<{ (event: 'onChangePage', value: number): void }>()
function changePage(page: string) {
  if (page === '…') return
  emit('onChangePage', parseInt(page))
}
</script>

<template>
  <nav
    id="pagination"
    class="w-100 bg-white p-3 d-flex justify-content-center mb-3"
    v-if="pages > 1"
  >
    <ul class="pagination mb-0">
      <li class="page-item" style="cursor: pointer" :class="{ disabled: current <= 1 }">
        <span class="page-link text-primary" @click="changePage((current - 1).toString())">
          <span aria-hidden="true">
            <i class="fas fa-angle-left"></i>
          </span>
        </span>
      </li>

      <li
        v-for="n in getPagination(current, pages)"
        :key="n"
        class="page-item"
        style="cursor: pointer"
        :class="{ disabled: n === current.toString() || n === '…' }"
      >
        <span class="page-link text-primary" @click="changePage(n)">
          {{ n }}
        </span>
      </li>

      <li class="page-item" style="cursor: pointer" :class="{ disabled: current >= pages }">
        <span class="page-link text-primary" @click="changePage((current + 1).toString())">
          <span aria-hidden="true">
            <i class="fas fa-angle-right"></i>
          </span>
        </span>
      </li>
    </ul>
  </nav>
</template>
