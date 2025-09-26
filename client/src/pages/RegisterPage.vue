<!-- 
    <script setup> is a new feature introduced in Vue 3 that eases the use of Composition API in an SFC.

    It allows us to define the component's props, reactive data, computed properties, and methods in a single block, making it easier to read and understand the component code. 

    It also automatically exposes our top-level bindings which means we don't have to add a return to expose our reactive states, methods to the template. We simply have to declare them. 
-->
<script setup>

    //import both watch and ref hooks
    import { watch, ref, onBeforeMount } from 'vue';
    //import Notyf to allow the use of an alternative notification window.
    import { Notyf } from 'notyf';
    import { useRouter } from 'vue-router';
    import { useGlobalStore } from '../stores/global';
    import axios from 'axios';
    import api from '../api';

    //Create a reactive state for each input.
    //We will bind the input to our reactive state.
    //When the input value is updated so will the reactive state it is bound, vice versa.
    //This is called Two-Way Binding.
    //This is to ensure that we are able to capture the input data into our state.

    const firstName = ref("");
    const lastName = ref("");
    const mobileNum = ref("");
    const email = ref("");
    const password = ref("");
    const confirmPass = ref("");
    const isEnabled = ref(false);

    const notyf = new Notyf();

    const router = useRouter();

    const {user} = useGlobalStore();

    //Add a watch() hook to check the value of the input states.
    //Whenever the user types into an input, the bound reactive state will also be updated.
    //This watch() hook checks the values of the input states and enables/disables our button.
    watch([firstName,lastName,mobileNum,email,password,confirmPass], (currentValue, oldValue) => {
        // console.log(currentValue);

        //When watching multiple reactive states, the currentValue and oldValue returns an array of the current and old values of the states respectively.
        //Checks if every state does not contain an empty string and if the current value of the password and confirm password matches. If both conditions are met, we will enable the submit button. Else, it will remain disabled.
        //.every() can be used here in the condition as it returns a boolean.
        if(currentValue.every(input => input !== "") && currentValue[4] === currentValue[5]){
            isEnabled.value = true
        } else {
            isEnabled.value = false
        }
    });

    async function handleSubmit(e){
        //e - the event object passed into the function
        //e.preventDefault() method disables the default behavior of submit event which refreshes the page upon submission.
        // e.preventDefault();

        //For now, log the values of the input states.
        // console.log(email.value);
        // console.log(password.value);
        // console.log(confirmPass.value);

        try{
            await api.post('/users/checkEmail', {
                email: email.value
            })

            let response = await api.post('/users/register', {
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                mobileNo: mobileNum.value,
                password: password.value
            })

            if(response.status === 201){
                notyf.success("Registration Successful");

                //Clear values after submission
                firstName.value = "";
                lastName.value = "";
                mobileNum.value = "";
                email.value = "";
                password.value = "";
                confirmPass.value = "";

                router.push({path: '/login'})
            }else{
                notyf.error("Registration Failed. Please contact the administrator.")
            }
        }catch(e){
            if(
                e.response.status === 404 || 
                e.response.status === 401 ||
                e.response.status === 400 ||
                e.response.status === 409
            ){
                notyf.error(e.response.data.message);
            }else{
                console.error(e);
                notyf.error('Registration Failed. Please contact the administrator.')
            }
        }
    }

    onBeforeMount(() => {
        if(user.token){
            router.push({path: '/login'})
        }
    })
    
</script>

<template>
    <div class="container-fluid">
        <h1 class="my-5 pt-3 text-primary text-center">Register Page</h1> 
        <div class="row d-flex justify-content-center">
            <div class="col-md-5 border border rounded-3 mx-auto p-5">
                <form v-on:submit.prevent="handleSubmit">
                    <div class="mb-3">
                        <label for="fName" class="form-label">First Name</label>
                        <input type="text" class="form-control" id="fName" v-model="firstName" />
                    </div>
                    <div class="mb-3">
                        <label for="lName" class="form-label">Last Name</label>
                        <input type="text" class="form-control" id="lName" v-model="lastName" />
                    </div>
                    <div class="mb-3">
                        <label for="mobile" class="form-label">Mobile Number</label>
                        <input type="text" class="form-control" id="mobile" v-model="mobileNum" />
                    </div>
                    <div class="mb-3">
                        <label for="emailInput" class="form-label">Email Address</label>
                        <!-- v-bind:value = allows us to bind the value of this input to an exposed variable -->
                        <!-- v-on:input is an event listener directive that allow us to run a given function as the user types in an input. -->
                        <!-- 
                            $event - is the event object which contains information about "what happened" in the element. This event object can be passed into the event listener function for processing.

                            $event.target - is the element where the event happened.
                            $event.target.value - the value of the element where the event happened.

                            email = $event.target.value - update the value of the email state with the current value of the element.
                        -->
                        <!-- <input type="email" class="form-control" id="emailInput" v-bind:value="email" v-on:input=" email = $event.target.value"/> -->

                        <!-- v-model is a directive which also allows for binding the value of an element to an exposed variable. However, v-model also automatically adds the current value of the element into the reactive state upon user input-->
                        <input type="email" class="form-control" id="emailInput" v-model="email" />
                    </div>
                    <div class="mb-3">
                        <label for="passwordInput" class="form-label">Password</label>
                        <!-- <input type="password" class="form-control" id="passwordInput" v-bind:value="password" v-on:input=" password = $event.target.value"/> -->
                        <input type="password" class="form-control" id="passwordInput" v-model="password" />
                    </div>
                    <div class="mb-3">
                        <label for="cpasswordInput" class="form-label">Confirm Password</label>
                        <!-- <input type="password" class="form-control" id="cpasswordInput" v-bind:value="confirmPass" v-on:input=" confirmPass = $event.target.value"/> -->
                        <input type="password" class="form-control" id="cpasswordInput" v-model="confirmPass" />
                    </div>
                    <div class="d-grid mt-5">
                        <button type="submit" class="btn btn-primary btn-block" v-if="isEnabled">Submit</button>
                        <button type="submit" class="btn btn-danger btn-block" disabled v-else>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
