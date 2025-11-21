<script setup lang="ts">
import { camelToTitle, getPath } from '@/helpers/utils'
import type { Course } from '@/models/courses'
import type { Student } from '@/models/students'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import NoData from './NoData.vue'
import TablePagination from './TablePagination.vue'
import DataSpinner from './DataSpinner.vue'

const dataLoaded = ref<boolean>(false)
onMounted(() => {
  window.setTimeout(() => {
    dataLoaded.value = true
  }, 300)
})

const { data, pages, isLoading, currentPage } = defineProps<{
  data: Array<Student | Course>
  pages: number
  isLoading: boolean
  currentPage: number
}>()

const emit = defineEmits<{
  (event: 'deleteItem', value: string): void
  (event: 'onChangePage', value: number): void
}>()
const router = useRouter()

function handleAction(item: Student | Course, action: string) {
  if (action === 'delete') {
    emit('deleteItem', item.id)
  } else {
    router.push({
      path: `/${getPath()}/${item.id}/${action}`,
    })
  }
}
</script>

<template>
  <section
    id="table"
    class="container my-3 table-responsive d-flex flex-column justify-content-between rounded-3 bg-white"
    style="min-height: 400px"
  >
    <data-spinner v-if="isLoading || !dataLoaded" />
    <NoData v-else-if="!isLoading && dataLoaded && data.length === 0" />
    <div v-else style="overflow-y: auto">
      <table class="table table-striped table-hover table-borderless">
        <thead>
          <tr>
            <template v-for="(_, key) in data[0]" :key="key">
              <th scope="col" v-if="key !== 'id'" class="text-capitalize py-3 px-4">
                {{ camelToTitle(key) }}
              </th>
            </template>
            <th scope="col" class="text-capitalize py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in data" :key="index">
            <template v-for="(value, key) in item" :key="value">
              <td v-if="key !== 'id'" class="px-4">
                {{ value }}
              </td>
            </template>
            <td class="text-center px-4">
              <div class="d-flex justify-content-center">
                <button
                  class="btn btn-sm btn-outline-primary me-3 px-4"
                  @click="handleAction(item, 'edit')"
                >
                  Edit
                </button>
                <button
                  class="btn btn-sm btn-outline-danger px-3"
                  @click="handleAction(item, 'delete')"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <table-pagination
      v-if="!isLoading && dataLoaded"
      :pages="pages"
      :current="currentPage"
      @on-change-page="(e: number) => $emit('onChangePage', e)"
    />
  </section>
</template>
