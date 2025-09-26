<script setup>
  // onBeforeMount() is a lifecycle hook much like onMounted().
  import { onBeforeMount, ref } from 'vue';
  import { useGlobalStore } from '../stores/global';

  // Retrieve the global user state from the global store by destructuring it.
  const {user} = useGlobalStore();
  console.log(user);

  const email = ref("");

  /*
    onBeforeMount is used just before the component is mounted on the page.

    This means that it will be executed before the component is visible to the user

    onBeforeMount usually used to fetching initial data from an API or initializing data that will be used by the component.
  */
  // onBeforeMount(() => {
  //   email.value = localStorage.getItem('email')
  // });
</script>

<template>
  <nav class="navbar navbar-expand-lg sticky-top bg-light shadow-sm">
    <div class="container">
      <!-- router-link is used to navigate to pages using the Vue Routing system -->
      <!-- This will prevent the page to refresh when changing pages. -->
      <!-- :to="{ name: 'Home' }" is a Router Link option that tells the router-link which page to go -->
      <router-link :to="{ name: 'Home' }" class="navbar-brand text-dark fw-bold">ZUITT</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav ms-auto">
          <router-link :to="{ name: 'Courses' }" class="nav-link">Courses</router-link>
          <router-link :to="{ name: 'News' }" class="nav-link">News</router-link>
          <router-link :to="{ name: 'Profile' }" class="nav-link" v-if="user.email">Profile</router-link>
          <router-link :to="{ name: 'AddCourse' }" class="nav-link" v-if="user.email && user.isAdmin">Add Course</router-link>
          <router-link :to="{ name: 'Register' }" class="nav-link" v-if="!user.email">Register</router-link>
          <router-link :to="{ name: 'Login' }" class="nav-link" v-if="!user.email">Login</router-link>
          <router-link :to="{ name: 'Logout' }" class="nav-link" v-else-if="user.email">Logout</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>
