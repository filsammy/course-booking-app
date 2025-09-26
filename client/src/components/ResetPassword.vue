<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-body">
            <h3 class="card-title mb-4">Reset Password</h3>
            <form @submit.prevent="handleReset">
              <div class="mb-3">
                <label for="newPassword" class="form-label">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  v-model="newPassword"
                  class="form-control"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                {{ loading ? 'Resetting...' : 'Reset Password' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'
import api from '../api' // adjust path to your api instance
import { useGlobalStore } from '../stores/global'

const newPassword = ref('')
const loading = ref(false)
const notyf = new Notyf()

const handleReset = async () => {
  try {
    loading.value = true

    const { user } = useGlobalStore() // or from Pinia store, etc.

    if (!user.token) {
      notyf.error('You are not authorized')
      loading.value = false
      return
    }

    await api.put('/users/reset-password', { newPassword: newPassword.value } )
    // , {
    //   headers: {
    //     Authorization: `Bearer ${token}`
    //   }
    // })

    notyf.success('Password reset successfully')
    newPassword.value = ''
  } catch (err) {
    const msg = err.response?.data?.message || 'Password reset failed'
    notyf.error(msg)
  } finally {
    loading.value = false
  }
}
</script>
