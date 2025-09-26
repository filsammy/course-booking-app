<script setup>
import { reactive, watch, ref } from 'vue';
import { Notyf } from 'notyf';
import newsData from '../data/newsData.js';
import NewsComponent from '../components/NewsComponent.vue'
import { useGlobalStore } from '../stores/global';

const {user} = useGlobalStore();

const news = reactive(newsData)
const email = ref("");
const feedback = ref("");
const isEnabled = ref(false);
const emailError = ref("");
const feedbackError = ref("");
const notyf = new Notyf();

watch([email, feedback], ([e, f]) => {
  isEnabled.value = e.trim() !== '' && f.trim() !== ''
})

function handleSubmit(e) {
    e.preventDefault();

    console.log('Email:', email.value);
    console.log('Feedback:', feedback.value);


    notyf.success('Feedback submitted successfully');

    email.value = '';
    feedback.value = '';
}
</script>

<template>
    <div class="container">
        <div class="row">
            <div class="col my-5">
                <h1 class="text-center text-primary py-1">News</h1>
            </div>
        </div>
        <div class="row g-4">
            <NewsComponent
            v-for="n in news"
            :key="n.id || n.slug || n.title"
            :newsData="n"
            />
        </div>
    </div>
    
    <div class="container-fluid" v-if="user.email">
        <h1 class="my-5 pt-3 text-primary text-center">Feedback Form</h1>
        <div class="row d-flex justify-content-center">
            <div class="col-md-6 border rounded-3 mx-auto p-5">
                <form @submit.prevent="handleSubmit">
                    <div class="mb-3">
                        <label for="emailInput" class="form-label">Email Address</label>
                        <input type="email" class="form-control" id="emailInput"
                        v-model="email"
                        />
                    </div>
                    
                    <div class="mb-3">
                        <label for="feedback" class="form-label">Feedback</label>
                        <textarea name="feedback" id="feedback" class="form-control"  rows="5" v-model="feedback"></textarea>
                    </div>
                    
                    <div class="d-grid mt-5">
                        <button type="submit" class="btn btn-primary btn-block" v-if="isEnabled">Send Feedback</button>
                        <button type="submit" class="btn btn-danger btn-block" disabled v-else>Send Feedback</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
