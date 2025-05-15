<template>
  <div class="mt-6 w-full max-w-md">
    <p class="text-xs text-gray-500">Auth state: {{ state.isAuthenticated }}</p>
    <TodoList v-if="state.isAuthenticated" />
    <Login v-else />
  </div>
</template>

<script setup>

import { onMounted } from 'vue';
import { useAuth } from '../lib/authStore';
import Login from './Login.vue';
import TodoList from './TodoList.vue';

const { state, checkSession } = useAuth();

onMounted(() => {
  console.log('[AuthGate] Checking session...');
  checkSession();
});


</script>
