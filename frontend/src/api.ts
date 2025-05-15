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
