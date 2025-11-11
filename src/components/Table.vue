<script lang="ts">
import { camelToTitle, getPath } from '@/helpers/utils'

export default {
  name: 'TableComponent',
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
  computed: {
    page(): number {
      const page = parseInt(this.$route.query.page as string) || 1
      return page
    },
  },
}
</script>

<template>
  <section
    id="table"
    class="container my-3 table-responsive flex-grow-1 d-flex flex-column justify-content-between"
    style="min-height: 500px"
  >
    <div id="table--empty" v-if="data.length === 0">
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
    <nav
      id="pagination"
      class="w-100 bg-white p-3 d-flex justify-content-center mb-3"
      v-if="pages > 1"
    >
      <ul class="pagination mb-0">
        <li class="page-item" :class="{ disabled: page <= 1 }">
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
        <li class="page-item" :class="{ disabled: page <= 1 }">
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
        <li v-for="n in pages" :key="n" class="page-item" :class="{ disabled: n === page }">
          <a class="page-link text-black" @click="$router.push({ query: { page: n } })">{{ n }}</a>
        </li>
        <li class="page-item" :class="{ disabled: page >= pages }">
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
        <li class="page-item" :class="{ disabled: page >= pages }">
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
  </section>
</template>
