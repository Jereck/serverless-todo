import React, { useState } from 'react';
import { Auth } from 'aws-amplify';

export default function AuthForm({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (authMode === 'signup') {
        await Auth.signUp({ username: email, password, attributes: { email } });
        setMessage('Signup successful! Please check your email for confirmation.');
      } else {
        await Auth.signIn(email, password);
        onAuthenticated();
      }
    } catch (err: any) {
      setMessage(err.message || 'Authentication error');
    }
  };

  return (
    <div>
      <h2>{authMode === 'signup' ? 'Sign Up' : 'Sign In'}</h2>
      <form onSubmit={handleSubmit}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
        <button type="submit">{authMode === 'signup' ? 'Sign Up' : 'Sign In'}</button>
      </form>
      <p>{message}</p>
      <button onClick={() => setAuthMode(authMode === 'signup' ? 'signin' : 'signup')}>
        Switch to {authMode === 'signup' ? 'Sign In' : 'Sign Up'}
      </button>
    </div>
  );
}
