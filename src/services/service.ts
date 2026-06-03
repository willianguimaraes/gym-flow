import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import qs from 'qs';

interface CustomRequestConfig extends AxiosRequestConfig {
    loadingRequest?: boolean;
}
export class Service {
  protected api: AxiosInstance;
  private readonly defaultConfig: CustomRequestConfig = { loadingRequest: true };
  constructor(baseURL: string = process.env.APP_API_URL || 'http://localhost:3000') {
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: unknown) => {
        if (error instanceof Error) {
          return Promise.reject(error);
        }
        return Promise.reject(new Error(String(error)));
      }
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error: unknown) => {
        if (error instanceof Error && 'response' in error) {
          const axiosError = error as unknown as { response?: { status: number } };
          if (axiosError.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }
        }
        if (error instanceof Error) {
          return Promise.reject(error);
        }
        return Promise.reject(new Error(String(error)));
      }
    );
  }

    protected getAll (url: string, filtros = [], requestConfig: CustomRequestConfig  = this.defaultConfig) {
        const params = {};
        if (filtros) {
            Object.assign(params, filtros);
        }
        return this.api.get(url, {
            params: params,
            paramsSerializer: {
                serialize: (params) => {
                    return qs.stringify(params, { arrayFormat: 'repeat' });
                }
            },
            ...requestConfig
        });
    }

  protected get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
        return this.api.get(url, config);
    } catch (error) {
      if (axios.isAxiosError(error)) {
          throw error.response?.data;
      }
      throw error;
    }
  }

  protected post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
        return this.api.post(url, data, config);
    } catch (error) {
      console.log('Erro na requisição POST:', error);
      if (axios.isAxiosError(error)) {
          throw error.response?.data;
      }
      throw error;
    }
  }

  protected put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return this.api.put(url, data, config);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data;
      }
      throw error;
    }
  }

  protected patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return this.api.patch(url, data, config);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data;
      }
      throw error;
    }
  }

  protected delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return this.api.delete(url, config);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data;
      }
      throw error;
    }
  }
}
