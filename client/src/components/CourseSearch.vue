<template>
  <div class="container py-4">
    <h2 class="mb-4">Search Courses</h2>

    <form @submit.prevent="searchCourses" class="mb-4" style="max-width: 500px;">
      <div class="input-group">
        <input
          type="text"
          v-model="courseName"
          class="form-control"
          placeholder="Enter course name"
          required
        />
        <button class="btn btn-primary" type="submit" :disabled="loading">
          {{ loading ? "Searching..." : "Search" }}
        </button>
      </div>
    </form>

    <div v-if="courses.length">
      <h5>Results:</h5>
      <!-- <ul class="list-group">
        <li v-for="course in courses" :key="course._id" class="list-group-item">
          <strong>{{ course.name }}</strong>
          <div class="text-muted">{{ course.description }}</div>
        </li>
      </ul> -->
      <div>
        <CourseComponent v-for="course in courses" :key="course._id" :courseData="course" />
      </div>
    </div>

    <div v-else-if="!loading && hasSearched">
      <p class="text-muted">No courses found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'
import api from '../api' // Make sure this Axios instance is set up correctly
import CourseComponent from './CourseComponent.vue'

const courseName = ref('')
const courses = ref([])
const loading = ref(false)
const hasSearched = ref(false)

const notyf = new Notyf()

const searchCourses = async () => {
  if (!courseName.value.trim()) {
    notyf.error('Please enter a course name.')
    return
  }

  loading.value = true
  hasSearched.value = true

  try {
    const response = await api.post('/courses/search', {
      courseName: courseName.value.trim(),
    })

    courses.value = response.data || []
    if (courses.value.length) {
      notyf.success(`Found ${courses.value.length} course(s).`)
    } else {
      notyf.error('No courses found.')
    }
  } catch (error) {
    console.error(error)
    notyf.error('Something went wrong while searching.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Optional: Add some spacing to results */
.list-group-item + .list-group-item {
  margin-top: 0.5rem;
}
</style>
