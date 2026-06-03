
import { Service } from './service';
import type { AxiosResponse } from 'axios';
import type { RegisterDTO, LoginDTO } from '../types/Usuario';
import type { ApiResponse } from '../types/Response';
import type { LoginResponse } from '../types/LoginResponse';

export class LoginService extends Service {

    async register(registerData: RegisterDTO): Promise<AxiosResponse<ApiResponse<null>>> {
        return this.post<ApiResponse<null>>('/api/auth/register', registerData);
    }

    async login(loginData: LoginDTO): Promise<AxiosResponse<ApiResponse<LoginResponse>>> {
        return this.post<ApiResponse<LoginResponse>>('/api/auth/login', loginData);
    }

    async obterDadosUsuario(): Promise<AxiosResponse<ApiResponse<{ username: string }>>> {
        return this.get<ApiResponse<{ username: string }>>('/api/auth/me');
    }
}