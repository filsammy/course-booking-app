<!-- When creating a new VueJS component, it must consist of 3 blocks, template, script and style. -->
<!-- When naming a component, it must consist of two words and preferably in PascalCase -->
<!-- Each SFC block consists of HTML-like tags that encapsulates the block. They can be in any order. -->
<template>
  <div class="row mb-5 py-5" id="banner">
    <div class="col-md-10 p-5 ms-5">
      <h1 class="mb-3" id="banner-title">{{bannerProps.title}}</h1>
      <p class="mb-5" id="motto">{{bannerProps.tagline}}</p>
      <a class="btn btn-primary btn-lg rounded-pill px-3 ">View our Courses!<i class="bi bi-arrow-right"></i></a>
    </div>
  </div>
</template>

<script>
  // export default allows us to define the components registration and its properties using Options API or Composition API
  // defining the props property using the Options API will allow components to be completely reusable. It will allow us to pass data from a parent component to a child component.
  export default {
    // props property is from Options API that allow us to define the props that can be passed to a component
    props: {
      // when defining props of a component, add the name of the props (properties) and its data type
      // title: String,
      // tagline: String
      bannerProps: Object
    },
    // mounted() method can be added which is a function/methid that will run when the component is mounted.\
    // a component is mounted when it is displayed and updated into the DOM
    mounted(){
      console.log(this.bannerProps.title);
      console.log(this.bannerProps.tagline);
    }
  }
</script>