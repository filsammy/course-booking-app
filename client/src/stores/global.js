// A store is a container for managing the state of an app.
// It is a reactive object and holds the application's data and has methods used for updating and accessing the data
// Stores are defined using defineStore() function and can be registered globally or locally within a component
import { defineStore } from 'pinia';
import { reactive } from 'vue';
import axios from 'axios';
import api from '../api';

// defineStore() creates a store. It has 2 arguments, the unique id of the store and the callback function that defines and return the states and actions of the store
export const useGlobalStore = defineStore('global', () => {
  let user = reactive({
    token: localStorage.getItem('token'),
    email: null,
    isAdmin: null,
    firstName: null,
    lastName: null,
    mobileNo: null
  })

  // We can add a function/action that allows us to update the global state
  // getUserDetails() receives the user's email as an argument and updates our state's email property.
  async function getUserDetails(token) {
    if (!token) {
      user.token = null;
      user.email = null;
      user.isAdmin = null;
      user.firstName = null;
      user.lastName = null;
      user.mobileNo = null;

      return;
    }

    let { data } = await api.get('/users/details');

    console.log(data);

    user.token = token;
    user.email = data.email;
    user.isAdmin = data.isAdmin;
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.mobileNo = data.mobileNo;

  }

  // When useGlobalStore is used in our application, it will return an object that cotains the global state and actions.
  return {
    user,
    getUserDetails
  }
})
