export interface User {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  name: string;
  email: string;
  role: string;
}
