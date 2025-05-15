<template>
  <div class="w-full max-w-md space-y-4">
    <div class="flex gap-2">
      <input
        v-model="newTodo"
        type="text"
        placeholder="Add a todo..."
        class="flex-1 border px-2 py-1"
      />
      <button @click="handleAdd" class="bg-green-600 text-white px-4 py-1 rounded">
        Add
      </button>
    </div>

    <ul class="space-y-2">
      <li
        v-for="todo in todos"
        :key="todo.todoId"
        class="flex justify-between items-center border px-4 py-2 rounded"
      >
        <span>{{ todo.title }}</span>
        <button @click="handleDelete(todo.todoId)" class="text-red-500">✕</button>
      </li>
    </ul>

    <button @click="logout" class="text-blue-500 text-sm mt-2">Log out</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuth } from '../lib/authStore';

const { state, logout } = useAuth();
const todos = ref([]);
const newTodo = ref('');

const fetchTodos = async () => {
  try {
    const res = await fetch('https://uzfaqnnmth.execute-api.us-east-1.amazonaws.com/todos', {
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
    });
    todos.value = await res.json();
  } catch (err) {
    console.error('Failed to fetch todos:', err);
  }
};

const handleAdd = async () => {
  if (!newTodo.value) return;
  try {
    const res = await fetch('https://uzfaqnnmth.execute-api.us-east-1.amazonaws.com/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.token}`,
      },
      body: JSON.stringify({ title: newTodo.value }),
    });
    const created = await res.json();
    todos.value.push(created);
    newTodo.value = '';
  } catch (err) {
    console.error('Failed to create todo:', err);
  }
};

const handleDelete = async (id) => {
  try {
    await fetch(`https://uzfaqnnmth.execute-api.us-east-1.amazonaws.com/todos/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
    });
    todos.value = todos.value.filter((t) => t.todoId !== id);
  } catch (err) {
    console.error('Failed to delete todo:', err);
  }
};

onMounted(fetchTodos);
</script>
