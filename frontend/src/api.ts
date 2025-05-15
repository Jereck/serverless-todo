const API_BASE = 'https://uzfaqnnmth.execute-api.us-east-1.amazonaws.com';

export async function fetchTodos(token: string) {
  const res = await fetch(`${API_BASE}/todos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch todos: ${res.statusText}`);
  }

  return res.json();
}

export async function createTodo(token: string, title: string) {
  const res = await fetch(`${API_BASE}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) {
    throw new Error(`Failed to create todo: ${res.statusText}`);
  }

  return res.json();
}

export async function updateTodo(token: string, todoId: string, title: string) {
  const res = await fetch(`${API_BASE}/todos/${todoId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) {
    throw new Error(`Failed to update todo: ${res.statusText}`);
  }

  return res.json();
}

export async function deleteTodo(token: string, todoId: string) {
  const res = await fetch(`${API_BASE}/todos/${todoId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  if (!res.ok) {
    throw new Error(`Failed to delete todo: ${res.statusText}`);
  }
  return res.json();
}