import React, { useEffect, useState } from 'react';
import AuthForm from './components/AuthForm';
import { Auth } from 'aws-amplify';
import { fetchTodos } from './api';
import './awsConfig'; // Ensure this is imported to configure Amplify

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  type Todo = { todoId: string; title: string };
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      Auth.currentSession().then(session => {
        const token = session.getAccessToken().getJwtToken();
        console.log("Access token:", token);
        fetchTodos(token).then(setTodos);
      });
    }
  }, [isAuthenticated]);

  return (
    <div>
      <h1>Serverless Todo App</h1>
      {!isAuthenticated ? (
        <AuthForm onAuthenticated={() => setIsAuthenticated(true)} />
      ) : (
        <div>
          <h2>Your Todos</h2>
          <ul>
            {todos.map(todo => (
              <li key={todo.todoId}>{todo.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
