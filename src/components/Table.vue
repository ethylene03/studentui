<script lang="ts">
import { camelToTitle, getPath } from '@/helpers/utils'
import Pagination from './Pagination.vue'
import NoData from './NoData.vue'
import Spinner from './Spinner.vue'

export default {
  name: 'TableComponent',
  components: {
    Pagination,
    NoData,
    Spinner,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
    pages: {
      type: Number,
      default: 5,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    camelToTitle,
    handleAction(item: any, action: string) {
      if (action === 'delete') {
        this.$emit('deleteItem', (item as any).id)
      } else {
        this.$router.push({
          path: `/${getPath()}/${(item as any).id}/${action}`,
        })
      }
    },
  },
}
</script>

<template>
  <section
    id="table"
    class="container my-3 table-responsive d-flex flex-column justify-content-between rounded-3 bg-white"
    style="min-height: 400px"
  >
    <Spinner v-if="isLoading" />
    <NoData v-else-if="!isLoading && data.length === 0" />
    <div v-else style="overflow-y: auto">
      <table class="table table-striped table-hover table-borderless">
        <thead>
          <tr>
            <template v-for="(_, key) in data[0]" :key="key">
              <th scope="col" v-if="key !== 'id'" class="text-capitalize py-3 px-4">
                {{ camelToTitle(key as string) }}
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
    <Pagination v-if="!isLoading" :pages="pages" />
  </section>
</template>
