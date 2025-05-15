<template>
  <div class="max-w-md space-y-4">
    <h2 class="text-xl font-bold">{{ mode === 'login' ? 'Login' : 'Sign Up' }}</h2>
    <form @submit.prevent="handleSubmit" class="space-y-2">
      <input
        type="email"
        v-model="email"
        placeholder="Email"
        class="border p-2 w-full"
        required
      />
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        class="border p-2 w-full"
        required
      />
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 w-full">
        {{ mode === 'login' ? 'Login' : 'Sign Up' }}
      </button>
      <p v-if="state.message" class="text-sm text-red-600 mt-1">{{ state.message }}</p>
    </form>
    <button @click="toggleMode" class="text-sm text-blue-500">
      Switch to {{ mode === 'login' ? 'Sign Up' : 'Login' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '../lib/authStore';

const email = ref('');
const password = ref('');
const mode = ref('login'); // just use string, no need for TS union

const { state, login, signup } = useAuth();

const toggleMode = () => {
  mode.value = mode.value === 'login' ? 'signup' : 'login';
};

const handleSubmit = async () => {
  if (mode.value === 'login') {
    await login(email.value, password.value);
  } else {
    await signup(email.value, password.value);
  }
};
</script>
