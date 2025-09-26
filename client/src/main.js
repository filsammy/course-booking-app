// After bootstrap installation, import bootstrap in main.js to be able to use bootstrap in all components.
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import 'notyf/notyf.min.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import HomePage from './pages/HomePage.vue';
import CoursesPage from './pages/CoursesPage.vue';
import LoginPage from './pages/LoginPage.vue';
import RegisterPage from './pages/RegisterPage.vue';
import LogoutPage from './pages/LogoutPage.vue';
import ViewCourse from './pages/ViewCourse.vue';
import ProfilePage from './pages/ProfilePage.vue';
import NewsPage from './pages/NewsPage.vue';
import AddCourse from './pages/AddCourse.vue';

import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: 'Home',
			component: HomePage
		},
		{
			path: '/courses',
			name: 'Courses',
			component: CoursesPage
		},
		{
			path: '/news',
			name: 'News',
			component: NewsPage
		},
		{
			path: '/profile',
			name: 'Profile',
			component: ProfilePage
		},
		{
			path: '/add-course',
			name: 'AddCourse',
			component: AddCourse
		},
		{
			path: '/login',
			name: 'Login',
			component: LoginPage
		},
		{
			path: '/register',
			name: 'Register',
			component: RegisterPage
		},
		{
			path: '/logout',
			name: 'Logout',
			component: LogoutPage
		},
		{
			path: '/courses/:id',
			name: 'ViewCourse',
			component: ViewCourse
		}
	]
})

/* 
	- Every Vue application starts by creating a new application instance with the createApp function.
	- We then pass the App component into the createApp method. 
	- The App component is a "root component" that can contain other components as its children.    
	- The mount() method is used to render/inject the root component into the selected element from the DOM by its id.
*/
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app');
