import axios from "axios";
console.log(import.meta.env.VITE_COURSE_BOOKING_API)
// Create an instance of axios that we can use throughout our application
// Use the environment variable VITE_COURSE_BOOKING_API to set the base URL for our API
const api = axios.create({
  baseURL: import.meta.env.VITE_COURSE_BOOKING_API,
});

// Add an interceptor to add the Authorization header to all our requests
// This is so that we can send the token to the server on each request
// We use the useUserStore hook to get the current user and their token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // Add the Authorization header with the token
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Export the instance of axios so that we can use it in our components
export default api;
