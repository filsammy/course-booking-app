<!-- ACTIVITY SOLUTION START -->
<script>
  import BannerComponent from '../components/BannerComponent.vue';
  import HighlightsComponent from '../components/HighlightsComponent.vue';

  export default {
    components: {
      BannerComponent,
      HighlightsComponent
    },
    // data() method is used to return the "reactive states" managed by a component using the Options API. It returns an object containing the initial values for the component's reactive state.
    // In Vue.js, a "reactive state" refers to any data or variables that are associated with a component can change during the component's lifecycle, causing the component to update and re-render
    // re-render means to update and re-display the component
    // States can be passed as a prop to another component
    data(){
      return {
        bannerProps: {
          title: "Zuitt Course Booking System",
          tagline: "Opportunities for everyone, everywhere!"
        }
      } 
    }
  }
</script>

<template>
  <div class="container-fluid">
    <!-- Values can be passed as a props using HTML like attributes. -->
    <!-- :props-name is called v-bind directive which allows us to pass objects as props -->
    <BannerComponent :bannerProps=bannerProps />
    <HighlightsComponent />
  </div>
</template>
<!-- ACTIVITY SOLUTION END -->