<template>
  <div>
    <BannerComponent :bannerProps="bannerData" />
  </div>
</template>

<script setup>
import BannerComponent from '../components/BannerComponent.vue'

const bannerData = {
  title: "404 - Not Found",
  tagline: "The page you are looking for cannot be found.",
  destination: "Home",
  buttonLabel: "Back to Home"
}
</script>

<!-- <template>
  <section class="py-5 text-center">
    <h1 class="mb-2">404 - Not Found</h1>
    <p class="mb-4">The page you are looking for cannot be found.</p>
    <RouterLink class="btn btn-primary" :to="{ name: 'Home' }">Back to Home</RouterLink>
  </section>
</template>

<script setup>
// no child component here — smoke test
</script> -->