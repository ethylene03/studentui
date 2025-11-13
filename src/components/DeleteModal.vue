<template>
  <div class="modal fade" id="modal--delete" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header border-bottom-0">
          <h1 class="modal-title fs-5">Delete Data</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body text-center py-4">
          Deleting this data is not reversible. Are you sure you want to delete?
        </div>
        <div class="modal-footer border-top-0 justify-content-center gap-4">
          <button type="button" class="btn btn-outline-primary px-5" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary px-5" @click="$emit('delete')">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>
