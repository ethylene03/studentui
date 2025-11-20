import { deleteCourse } from '@/helpers/api/courses'
import { Modal, Toast } from 'bootstrap'
import { ref } from 'vue'
import { deleteStudent } from '../api/students'
import { deleteUser } from '../api/users'

export function useDeleteItem(type: 'course' | 'student' | 'user') {
  const toDeleteId = ref<string>('')

  function showDeleteModal(id: string) {
    toDeleteId.value = id

    const modal = document.getElementById('modal--delete')
    if (modal) {
      const modalInstance = new Modal(modal as HTMLElement)
      modalInstance.show()
    }
  }

  async function deleteItem() {
    if (!toDeleteId.value) return
    const toast = document.getElementById('toast--delete')
    const modal = document.getElementById('modal--delete')

    const response =
      type === 'student'
        ? await deleteStudent(toDeleteId.value)
        : type === 'course'
          ? await deleteCourse(toDeleteId.value)
          : await deleteUser(toDeleteId.value)

    if (!response) {
      const modalInstance = Modal.getInstance(modal as HTMLElement)
      modalInstance?.hide()

      const toastInstance = new Toast(toast as HTMLElement)
      toastInstance.show()
    }
  }

  return { showDeleteModal, deleteItem }
}
