import type { User, CreateUserInput } from '../types/user';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const userService = {
  async createUser(input: CreateUserInput): Promise<User> {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<User>(response);
  },

  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_URL}/users`);
    return handleResponse<User[]>(response);
  },
};