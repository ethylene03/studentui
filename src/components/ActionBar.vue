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
    }
  },
  methods: {
    camelToTitle,
    onClickSort() {
      this.sortBy = this.sortBy === 'asc' ? 'desc' : 'asc'
      this.$emit('onClickSortBy')
    },
    getPath,
  },
  watch: {
    sortWith() {
      this.sortBy = 'asc'
      this.$emit('onChangeSortWith', this.sortWith)
    },
  },
}
</script>

<template>
  <div class="d-flex flex-column flex-md-row justify-content-between gap-4 align-items-center mb-3">
    <button class="btn btn-primary" @click="$router.push(`/${getPath()}/add`)">
      Add New {{ label }}
    </button>

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
      <button class="btn" @click="onClickSort">
        <i v-if="sortBy === 'asc'" class="fas fa-arrow-down-a-z"></i>
        <i v-else class="fas fa-arrow-up-a-z"></i>
      </button>
    </div>
  </div>
</template>
