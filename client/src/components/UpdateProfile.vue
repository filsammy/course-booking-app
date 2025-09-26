<template>
  <div class="container mt-5">
    <h2 class="text-primary text-center mb-4">Update Profile</h2>
    <form @submit.prevent="updateProfile" class="p-4 border rounded shadow-sm">
      <div class="mb-3">
        <label class="form-label">First Name</label>
        <input v-model="firstName" type="text" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Last Name</label>
        <input v-model="lastName" type="text" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Mobile Number</label>
        <input v-model="mobileNo" type="text" class="form-control" required />
      </div>
      <button class="btn btn-primary w-100">Update</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Notyf } from 'notyf'
import api from '../api'
import { useGlobalStore } from '../stores/global'

const { user } = useGlobalStore()

const firstName = ref('')
const lastName = ref('')
const mobileNo = ref('')
const loading = ref(false)
const notyf = new Notyf()

// Initialize form with user details when mounted
onMounted(() => {
  firstName.value = user.firstName || ''
  lastName.value = user.lastName || ''
  mobileNo.value = user.mobileNo || ''
})

const updateProfile = async () => {
  try {
    loading.value = true

    if (!user.token) {
      notyf.error('You are not authorized')
      loading.value = false
      return
    }

    await api.put(
      '/users/profile',
      {
        firstName: firstName.value,
        lastName: lastName.value,
        mobileNo: mobileNo.value
      },
      { headers: { Authorization: `Bearer ${user.token}` } }
    )

    // Update global store so ProfilePage displays new values
    user.firstName = firstName.value
    user.lastName = lastName.value
    user.mobileNo = mobileNo.value

    notyf.success('Profile updated!')

  } catch (err) {
    const msg = err.response?.data?.message || 'Update failed'
    notyf.error(msg)
  } finally {
    loading.value = false
  }
}
</script>
