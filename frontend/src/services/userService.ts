import type { User } from '../types/user';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const userService = {
  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    return handleResponse<User>(response);
  },

  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_URL}/users`);
    return handleResponse<User[]>(response);
  },
};
