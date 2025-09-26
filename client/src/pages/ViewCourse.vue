<script setup>
    import { onBeforeMount, reactive, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import api from '../api';
    import { Notyf } from 'notyf';
    import { useGlobalStore } from '../stores/global';

    const course = reactive({data: null});

    const notyf = new Notyf();

    const { user } = useGlobalStore();

    const router = useRouter();

    const isEditing = ref(false);
    const editForm = reactive({
    name: '',
    description: '',
    price: ''
    });

    async function handleEnroll(){
        let { data } = await api.post('/enrollments/enroll', {
            enrolledCourses: [
                {
                    courseId: course.data._id
                }
            ],
            totalPrice: course.data.price
        })

        if(data.success === true){
            notyf.success("Course Enrolled");
            router.push({path: '/courses'})
        }else{
            notyf.error("Enrollment failed.")
        }
    }

    // EDIT COURSE
    function handleEdit() {
    isEditing.value = true;
    editForm.name = course.data.name;
    editForm.description = course.data.description;
    editForm.price = course.data.price;
    }

    async function handleSave() {
    try {
    let { data } = await api.patch(`/courses/${course.data._id}`, {
      name: editForm.name,
      description: editForm.description,
      price: editForm.price
    });

    // Update local data so UI updates
    course.data = data;
    notyf.success("Course updated!");
    isEditing.value = false;
    router.push({path: '/courses'})
    } catch (err) {
        const msg = err.response?.data?.message || "Update failed";
        notyf.error(msg);
    }
    }

    // Delete COURSE
    async function handleDelete() {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
        await api.patch(`/courses/${course.data._id}/archive`);
        notyf.success("Course deleted!");
        router.push({ path: '/courses' }); // Go back to courses list
    } catch (err) {
        const msg = err.response?.data?.message || "Delete failed";
        notyf.error(msg);
    }
    }

    onBeforeMount(async () => {
        const route = useRoute();

        let { data } = await api.get(`/courses/specific/${route.params.id}`);

        course.data = data;
    })
</script>

<template>
    <div class="container">
        <nav class="my-3" aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><router-link to="/courses">Courses</router-link></li>
                <li class="breadcrumb-item active" aria-current="page">{{course.data ? course.data.name : '...'}}</li>
            </ol>
        </nav>
        <div class="row mx-auto my-3 gap-4 gap-md-0 ">
            <div class="col-12 col-md-6">
                <!-- placehold.co will generate a placeholder image based on the text provided -->
                <img 
                class="img-fluid rounded"
                :src="`https://placehold.co/600x400/63c3ff/ffffff?font=raleway&text=${encodeURIComponent(course.data.name)}`"
                >
            </div>
            <div class="col-12 col-md-6">
                <div class="d-flex gap-2 text-primary">
                    <h1 class="bi bi-mortarboard"></h1>
                    <h1 class="mb-3">{{course.data.name}}</h1>
                </div>
                <h6>Course Description:</h6>
                <p class="text-muted">
                    {{course.data.description}}
                </p>
                <p>
                    Price: PHP {{course.data.price}}
                </p>

                <!-- Add a click event to the Enroll button to trigger the handleEnroll function -->
                <!-- use v-if to check if the user email exists and if the user is not an admin -->
                <button class="btn btn-primary" type="button" v-if="user.email && !user.isAdmin" @click="handleEnroll">
                    Enroll
                </button>
                <!-- add another v-if to check if the user is an admin and disable the button -->
                <button class="btn btn-danger" type="button" v-if="user.email && user.isAdmin" disabled>
                    Admin are not allowed to enroll
                </button>
                <!-- add another v-if to check if the user is not logged in and redirect them to the login page  -->
                <router-link to="/login" class="btn btn-outline-danger" type="button" v-if="!user.email">
                    Login to Enroll
                </router-link>

                <div class="d-flex gap-2 mt-3" v-if="user.isAdmin">
                <button class="btn btn-danger" @click="handleDelete">
                    <i class="bi bi-trash"></i> Delete
                </button>
                <button class="btn btn-warning" @click="handleEdit" v-if="!isEditing">
                    <i class="bi bi-pencil"></i> Edit
                </button>
                </div>

                <!-- Edit Form -->
                <div v-if="isEditing" class="mt-3 p-3 border rounded bg-light">
                <h5>Edit Course</h5>
                <div class="mb-2">
                    <label class="form-label">Name</label>
                    <input v-model="editForm.name" type="text" class="form-control" />
                </div>
                <div class="mb-2">
                    <label class="form-label">Description</label>
                    <textarea v-model="editForm.description" class="form-control"></textarea>
                </div>
                <div class="mb-2">
                    <label class="form-label">Price</label>
                    <input v-model="editForm.price" type="number" class="form-control" />
                </div>
                <div class="d-flex gap-2 mt-2">
                    <button class="btn btn-success" @click="handleSave">Save</button>
                    <button class="btn btn-secondary" @click="isEditing = false">Cancel</button>
                </div>
                </div>


            </div>
        </div>

        <div class="text-center my-5" v-if="!course.data">
            <div class="spinner-grow"></div>
        </div>
    </div>
</template>
