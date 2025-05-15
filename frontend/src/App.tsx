import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthForm from './components/AuthForm';
import { createTodo, deleteTodo, fetchTodos, updateTodo } from './api';
import './awsConfig';

function AppContent() {
  const { isAuthenticated, token, logout } = useAuth();
  type Todo = { todoId: string; title: string };
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetchTodos(token).then(setTodos).catch(console.error);
  }, [token]);

  const handleAdd = async () => {
    const created = await createTodo(token, newTodo);
    setTodos([...todos, created]);
    setNewTodo('');
  };

  const handleUpdate = async (id: string, title: string) => {
    await updateTodo(token, id, title);
    setTodos(todos.map(todo => todo.todoId === id ? { ...todo, title } : todo));
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    await deleteTodo(token, id);
    setTodos(todos.filter(todo => todo.todoId !== id));
  };

  return (
    <div>
      <h1>Serverless Todo App</h1>
      {!isAuthenticated ? (
        <AuthForm />
      ) : (
        <div>
          <button onClick={logout}>Logout</button>
          <h2>Your Todos</h2>
          <input
            value={newTodo}
            onChange={e => setNewTodo(e.target.value)}
            placeholder="New todo"
          />
          <button onClick={handleAdd}>Add</button>

          <ul>
            {todos.map(todo =>
              <li key={todo.todoId}>
                {editingId === todo.todoId ? (
                  <>
                    <input
                      defaultValue={todo.title}
                      onBlur={(e) => handleUpdate(todo.todoId, e.target.value)}
                    />
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    {todo.title}
                    <button onClick={() => setEditingId(todo.todoId)}>Edit</button>
                    <button onClick={() => handleDelete(todo.todoId)}>Delete</button>
                  </>
                )}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
