<!-- ACTIVITY SOLUTION START -->
<script setup>

    // imported global stores, which contains our global states (user global states)
    import { useGlobalStore } from '../stores/global';
    import { watch, ref, onBeforeMount } from 'vue';
    import { Notyf } from 'notyf';
    // import the axios method from axios library to allow sending HTTP requests to our server
    import axios from 'axios';
    import { useRouter } from 'vue-router';
    import api from '../api.js';

    const email = ref("");
    const password = ref("");
    const isEnabled = ref(false);

    const notyf = new Notyf();
    const router = useRouter();

    const {getUserDetails, user} = useGlobalStore();

    watch([email,password], (currentValue, oldValue) => {

        if(currentValue.every(input => input !== "")){
            isEnabled.value = true
        } else {
            isEnabled.value = false
        }
    });

    async function handleSubmit(e){
        
        e.preventDefault();

        try{

            let res = await api.post('/users/login', {
                email: email.value,
                password: password.value
            })

            // console.log(res);

            if(res.data){
                notyf.success("Login Successful");

                // localStorage is a web storage API provided by most web browsers that allows us to store key-value pairs in the user's web browser.
                // the data stored in localStorage persists even after the user closes their browser or shuts down their computer
                // Data is saved as JSON in the localStorage. So later on, when we retrieve objects or other data types from it, we may have to parse it first.
                localStorage.setItem("token",res.data.access);

                getUserDetails(res.data.access);

                email.value = "";
                password.value = "";

                // its a JS function that will allow us to reload the page. We will do this temporarily because we cannot yet trigger a re-render in the Navbar component
                // window.location.reload();

                // .push() is a router method that receives an object as an argument. It's property is called path, which contains the endpoint of the page we want to redirect the user to.
                // It redirects the user to the desired page without refreshing the app.
                router.push({path: '/courses'})
            }
        }catch(e){
            if(e.response.status === 404 || e.response.status === 401 || e.response.status === 400){
                notyf.error(e.response.data.message);
            }else{
                notyf.error('Login Failed. Please contact the administrator');
            }
        }
    }

    // onBeforeMount(() => {
    //     if(user.token){
    //         router.push({path: '/courses'})
    //     }
    // })
</script>

<template>
	<div class="container-fluid">
	    <h1 class="my-5 pt-3 text-primary text-center">Login Page</h1> 
	    <div class="row d-flex justify-content-center">
	        <div class="col-md-5 border border rounded-3 mx-auto p-5">
	            <form v-on:submit="handleSubmit">
	                <div class="mb-3">
	                    <label for="emailInput" class="form-label">Email Address</label>
	                    <input type="email" class="form-control" id="emailInput" v-model="email" />
	                </div>
	                <div class="mb-3">
	                    <label for="passwordInput" class="form-label">Password</label>
	                    <input type="password" class="form-control" id="passwordInput" v-model="password" />
	                </div>
	                <div class="d-grid mt-5">
	                	<button type="submit" class="btn btn-primary btn-block"  v-if="isEnabled">Login</button>
                		<button type="submit" class="btn btn-danger btn-block" disabled v-else>Login</button>
	                </div>
	            </form>
	        </div>
	    </div>
    </div>
</template>
<!-- ACTIVITY SOLUTION END -->
