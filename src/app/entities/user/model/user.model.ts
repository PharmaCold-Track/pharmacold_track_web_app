export interface User {
  id: number;
  username: string;
  token?: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  token: string;
}
