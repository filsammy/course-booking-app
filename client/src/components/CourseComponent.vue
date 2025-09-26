<template>
	<div class="col-md-4">
		<div id="CourseCard" class="card p-2 h-100">
			<img 
				class="card-img-top"
				:src="`https://placehold.co/600x400/63c3ff/ffffff?font=raleway&text=${encodeURIComponent(courseData.name)}`"
				:alt="courseData.name"
			>
	     	<div class="card-body">
	         	<h4 class="card-title">
	            	<!-- You can embed JS expressions in VueJS HTML templates using Vue's HTML Template Syntax -->
                  	<!-- Double Moustaches {{}} will allow us to embed JS Expressions. Not only will it display variable values as text, it will also display the result of JS expressions. -->
                  	{{courseData.name}}
	         	</h4>
	         	<p class="card-text mt-3">
	             	{{courseData.description}}
	         	</p>
	         	<p>
	             	Price: PHP {{courseData.price}}
	         	</p>
	         	<p>
		          	Enrollees: {{enrollees}}
		        </p>
		        <p>
		          	Seats: {{seats}}
		        </p>
	         	<div class="mt-auto text-center d-grid">
		          <!--
		            add v-on: to listen to an event. 
		            v-on is a Vue JS directive that allow us to easily allow an element to listen to an event.
		            click is an event where the user clicks on an element.
		            v-on: takes an exposed function as a value and runs it when the event occurs.
		            Whenever the Enroll button is clicked the exposed function enroll from the script block is run.
		          -->
		          <router-link class="btn btn-outline-primary" :to="{ path: `/courses/${courseData._id}` }">View Course</router-link>
		        </div>
	     	</div>
		</div>
	</div>
</template>

<script>

	//import ref() from vue to create a reactive reference.
  	import { ref, watch } from "vue";
		import { useGlobalStore } from "../stores/global";

  	export default {
	    props: {
	      courseData: Object
	    },
	    //The first parameter in the setup() method is props. It is able to the receive the passed props. Props inside of a setup function are reactive and is updated when a new prop is passed.
	    //destructure the props object and return it to expose the reactive props to the template.
	    //The emit method can be destructured from the second parameter passed to the setup() method.
    	// The emit method is used to emit custom events from a child component to its parent component. It allows a child component to communicate with its parent component by sending messages, data or values that the parent component can receive and respond to.
    	setup({courseData},{emit}){

				const {user} = useGlobalStore();
	    
	      //To be able to create a reactive reference in VueJS composition API, we use the ref() method.
	      //This can be useful when you need to store a value that can be updated and accessed from multiple parts of your component's logic.
	      //ref() receives a single value as argument, preferably used with primitive values.
	      //The value passed as argument to ref is the initial value of the reactive state.
	      //ref() returns an object that can be updated. To update the value of a reactive reference, we update the value property.
	      const enrollees = ref(0);
	      const seats = ref(30);

		  const isEnabled = ref(true);

	      //A function can be added and exposed to the template to be used.
	      //The enroll method will update the value of enrollees reactive reference by 1 when the enroll button was clicked.
	      function enroll(){
	        enrollees.value++;
	        seats.value--;

	        //Emit a custom event to the parent component which also sends a value of one into the handling function.
        	//Every time we use the enroll button, a value of one is added into the count state in the parent component
        	//The emit method's first argument is the name of the custom event to be triggered in the parent component.
        	//The second argument is the value passed to the parent component.
        	//When emit method is run from the enroll method here, the "enrollment" custom event in the parent component will be triggered and run the function that is attached to it.
        	//The value from the emit will be received by the function attached to the custom event.
        	emit('enrollment',1);
	      }
	      
		  watch(seats, (currentValue, oldValue) => {

			if(currentValue === 0) {
				isEnabled.value = false
			} else {
				isEnabled.value = true
			}
		  });
		  
	      //value and methods returned from the setup method are exposed and can be used in the template
	      return {
	        courseData,
	        enrollees,
	        enroll,
	        seats,
					isEnabled,
					user
	      }
	    }
    }
</script>	
