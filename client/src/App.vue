<!-- 
  What is a component? 
    A component is a reusable part of an application.

  What is a VueJS Component?
    A VueJS component is an independent reusable part of an application. In VueJS, components are usually created with the concept of Single-File Component (SFC) which simply means that in VueJS, a component holds the HTML code, JS Script and CSS altogether in a file with a .vue extension instead of having and keeping separate files for each.

  An SFC consists of three parts:
    1. Template
    2. Script
    3. Style

  This provides a convenient way to organize and reuse components in a declarative and modular way. They also allow for better separation of concerns, making it easier to reason about the functionality and styling of a component
-->
<!-- Each SFC block consists of HTML-like tags that encapsulates the block. They can be in any order. -->

<!-- Script: A block of JavaScript code that defines the behavior and logic of the component. -->
<!-- <script setup> cannot contain ES module exports. -->
<script>
  // To be able to add a component into another component, in the script block, import the component 
  // The name of the component is the name of the file by default.
  // Add export default {} to be able to add the imported component in the root component.
  // import BannerComponent from './components/BannerComponent.vue';
  import NavbarComponent from './components/NavbarComponent.vue';
  import { useGlobalStore } from './stores/global';
  import { onBeforeMount } from 'vue';
  // import HomePage from './pages/HomePage.vue';
  // import CoursesPage from './pages/CoursesPage.vue';
  // import NewsPage from './pages/NewsPage.vue';
  // import RegisterPage from './pages/RegisterPage.vue';
  /* ACTIVITY SOLUTION START */
  // import LoginPage from './pages/LoginPage.vue';

  export default {
    components: {
      // BannerComponent,
      NavbarComponent,
      // HomePage,
      // CoursesPage,
      // NewsPage,
      // RegisterPage,
      // LoginPage
    },
    /* ACTIVITY SOLUTION END */
    setup(){
      const { getUserDetails } = useGlobalStore();

      onBeforeMount(() => getUserDetails(localStorage.getItem("token")));
    }
  }
</script>

<!-- Template: A block of HTML-like code that defines the structure of the component. -->
<template>
  <NavbarComponent />
  <!-- <router-view> is a Vue Router component that is used to display the component associated with the current route. -->
  <router-view />
  <!-- Banner component can be rendered in the page after import as its own html-like tag. -->
  <!-- <BannerComponent /> -->
  <!-- <HomePage />
  <CoursesPage />
  <NewsPage />
  <RegisterPage /> -->
  <!-- ACTIVITY SOLUTION START -->
  <!-- <LoginPage /> -->
  <!-- ACTIVITY SOLUTION END -->
</template>

<!-- Style: A block of CSS code that defines the styling of the component. -->
<style scoped>
</style>
