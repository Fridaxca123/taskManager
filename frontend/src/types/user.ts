export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  role?: string;
  created_at?: string;
}

export interface CreateUserInput {
  name: string;
  surname: string;
  role: string;
  email: string;
  password: string;

}
