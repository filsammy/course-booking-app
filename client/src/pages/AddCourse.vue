<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../api";
import { useGlobalStore } from "../stores/global";
import { Notyf } from "notyf";            

const notyf = new Notyf();        

const { user } = useGlobalStore();
const store = useGlobalStore();        
const router = useRouter();

const name = ref("");
const description = ref("");
const price = ref("");
const isEnabled = ref(false);          

watch([name, description, price], (vals) => {
    const [n, d, p] = vals;
    isEnabled.value =
    String(n).trim() !== "" &&
    String(d).trim() !== "" &&
    String(p).trim() !== "" &&
    Number(p) > 0;
});

async function handleSubmit() {
    try {
        const { data } = await api.post(`/courses`, {
            name: name.value,             
            description: description.value,
            price: Number(price.value)
        });
        
        if (data.success === true) {
            notyf.success("Course Added");
            // Clear fields (optional)
            name.value = "";
            description.value = "";
            price.value = "";
            router.push({ path: "/courses" });
        } else {
            notyf.error("Course Creation Failed");
        }
    } catch (e) {
        notyf.error(
        e?.response?.data?.message ||
        "Course Creation Failed. Please contact the administrator."
        );
    }
}

onBeforeMount(async () => {
    if (!user.email) {
        notyf.error("Please login first.");
        router.push({ path: "/login" });
        return;
    }
    if (user.isAdmin !== true) {
        notyf.error("Only admins can add courses.");
        router.push({ path: "/courses" });
    }
});
</script>

<template>
    
    <div class="container-fluid" v-if="user.email && user.isAdmin">
        <h1 class="my-5 pt-3 text-primary text-center">Add New Course</h1>
        <div class="row d-flex justify-content-center">
            <div class="col-md-6 border rounded-3 mx-auto p-5">
                <form @submit.prevent="handleSubmit">
                    
                    <!-- Course Name -->
                    <div class="mb-3">
                        <label for="courseName" class="form-label">Course Name</label>
                        <input type="text" class="form-control" id="courseName" v-model="name" />
                    </div>
                    
                    <!-- Description -->
                    <div class="mb-3">
                        <label for="courseDescription" class="form-label">Description</label>
                        <textarea id="courseDescription" class="form-control" rows="5" v-model="description"></textarea>
                    </div>
                    
                    <!-- Price -->
                    <div class="mb-3">
                        <label for="coursePrice" class="form-label">Price</label>
                        <input type="number" class="form-control" id="coursePrice" v-model="price" />
                    </div>
                    
                    <!-- Submit Button -->
                    <div class="d-grid mt-5">
                        <button type="submit" class="btn btn-primary btn-block" v-if="isEnabled">Add Course</button>
                        <button type="submit" class="btn btn-danger btn-block" disabled v-else>Add Course</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
