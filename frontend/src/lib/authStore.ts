import { reactive, readonly } from 'vue';
import { Auth } from 'aws-amplify';
import './awsConfig';

type AuthState = {
  isAuthenticated: boolean;
  token: string;
  message: string;
};

const state = reactive<AuthState>({
  isAuthenticated: false,
  token: '',
  message: '',
});

async function checkSession() {
  try {
    const session = await Auth.currentSession();
    state.token = session.getAccessToken().getJwtToken();
    state.isAuthenticated = true;
  } catch {
    state.token = '';
    state.isAuthenticated = false;
  }
}

async function login(email: string, password: string) {
  try {
    await Auth.signIn(email, password);
    await checkSession();
    state.message = 'Login successful';
  } catch (err: any) {
    state.message = err.message || 'Login failed';
  }
}

async function signup(email: string, password: string) {
  try {
    await Auth.signUp({
      username: email,
      password,
      attributes: { email },
    });
    state.message = 'Signup successful, check your email';
  } catch (err: any) {
    state.message = err.message || 'Signup failed';
  }
}

async function logout() {
  await Auth.signOut();
  state.token = '';
  state.isAuthenticated = false;
  state.message = '';
}

export function useAuth() {
  return {
    state: readonly(state),
    login,
    signup,
    logout,
    checkSession,
  };
}
