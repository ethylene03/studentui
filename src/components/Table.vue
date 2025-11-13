<script lang="ts">
import { camelToTitle, getPath } from '@/helpers/utils'
import Pagination from './Pagination.vue'

export default {
  name: 'TableComponent',
  components: {
    Pagination,
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
    <div id="table--empty" v-if="data.length === 0">
      <img
        src="https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127823.jpg?semt=ais_incoming&w=740&q=80"
        alt="no data available"
        class="d-block mx-auto my-5 w-25"
      />
      <p class="text-center my-5">No data available.</p>
    </div>
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
                  class="btn btn-sm btn-outline-primary me-3"
                  @click="handleAction(item, 'edit')"
                >
                  Edit
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="handleAction(item, 'delete')">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Pagination :pages="pages" />
  </section>
</template>
