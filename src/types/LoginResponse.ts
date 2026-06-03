export interface LoginResponse {
  token: string;
  user?: {
    id: number;
    usuario: string;
    email: string;
  };
}
