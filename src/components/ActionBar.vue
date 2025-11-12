<script lang="ts">
import { camelToTitle, getPath } from '@/helpers/utils'

export default {
  name: 'ActionBar',
  props: {
    label: {
      type: String,
      required: true,
    },
    sortOptions: {
      type: Array as () => Array<string>,
      required: true,
    },
  },
  data() {
    return {
      sortWith: '',
      sortBy: 'asc',
      query: '',
    }
  },
  methods: {
    camelToTitle,
    getPath,
    onClickSort() {
      this.sortBy = this.sortBy === 'asc' ? 'desc' : 'asc'
      this.$emit('onClickSortBy')
    },
    searchText() {
      this.$emit('onSearchText', this.query)
    },
  },
  watch: {
    sortWith() {
      this.sortBy = 'asc'
      this.$emit('onChangeSortWith', this.sortWith)
    },
    query() {
      this.searchText()
    },
  },
}
</script>

<template>
  <div class="d-flex flex-column flex-md-row justify-content-between gap-4 align-items-center mb-3">
    <button class="btn btn-primary" @click="$router.push(`/${getPath()}/add`)">
      Add New {{ label }}
    </button>

    <div>
      <div class="input-group w-auto mb-3 border border-primary bg-white rounded-3">
        <input
          id="searchInput"
          type="text"
          class="form-control rounded-3 border-0 bg-transparent"
          v-model="query"
          :placeholder="'Search ' + label + '...'"
        />
        <button class="input-group-text bg-transparent border-0" @click="searchText">
          <i class="fas fa-magnifying-glass"></i>
        </button>
      </div>

      <div class="d-flex align-items-center gap-3">
        <label for="sortWith" class="text-nowrap mb-0">Sort By:</label>
        <select v-model="sortWith" class="form-select border border-primary">
          <option value="">Sort by..</option>
          <template v-for="option in sortOptions" :key="option">
            <option v-if="option !== 'id'" :value="option">
              {{ camelToTitle(option as string) }}
            </option>
          </template>
        </select>
        <button class="btn text-primary" @click="onClickSort">
          <i v-if="sortBy === 'asc'" class="fas fa-arrow-down-a-z"></i>
          <i v-else class="fas fa-arrow-up-a-z"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#searchInput:focus {
  outline: none;
  box-shadow: none;
}
</style>
