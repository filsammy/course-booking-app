<script setup>

  import { onBeforeMount } from 'vue';
  import { useGlobalStore } from '../stores/global.js'
  import { useRouter } from 'vue-router';

  const { getUserDetails } = useGlobalStore();
  const router = useRouter();

  onBeforeMount(() => {
    
    localStorage.clear();

    getUserDetails(null);

    router.push({ path: '/login' });
  })

</script>
