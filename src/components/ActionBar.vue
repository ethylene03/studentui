<script setup lang="ts">
import { camelToTitle, getPath } from '@/helpers/utils'
import { ref, watch } from 'vue'

/*<--------- EMIT/PROPS --------->*/

const { label, sortOptions } = defineProps<{ label: string; sortOptions: Array<string> }>()
const emit = defineEmits<{
  (event: 'onSearchText', value: string): void
  (event: 'onClickSortBy'): void
  (event: 'onChangeSortWith', value: string): void
}>()

/*<--------- HANDLE SORTING --------->*/

const sortBy = ref<string>('asc')
function onClickSort() {
  sortBy.value = sortBy.value === 'asc' ? 'desc' : 'asc'
  emit('onClickSortBy')
}

const sortWith = ref<string>('')
watch(sortWith, () => {
  sortBy.value = 'asc'
  emit('onChangeSortWith', sortWith.value)
})

/*<--------- SEARCHING --------->*/

const query = ref<string>('')
watch(query, () => {
  searchText()
})

function searchText() {
  emit('onSearchText', query.value)
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
        <button
          id="search--button"
          class="input-group-text bg-transparent border-0 text-primary"
          @click="searchText"
        >
          <i class="fas fa-magnifying-glass"></i>
        </button>
      </div>

      <div class="d-flex align-items-center gap-3">
        <label for="sortWith" class="text-nowrap mb-0">Sort By:</label>
        <select v-model="sortWith" class="form-select border border-primary">
          <option value="" hidden>Sort by..</option>
          <template v-for="option in sortOptions" :key="option">
            <option v-if="option !== 'id'" :value="option">
              {{ camelToTitle(option as string) }}
            </option>
          </template>
        </select>
        <button
          class="btn text-primary border border-primary bg-white"
          @click="onClickSort"
          :class="{ disabled: !sortWith }"
        >
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

#search--button {
  cursor: pointer;
}
</style>
