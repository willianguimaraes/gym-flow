import { Service } from './service';
import type { AxiosResponse } from 'axios';
import type { ExercicioCatalogo } from '../types/ExercicioCatalogo';
import type { ApiResponse } from '../types/Response';

export class CatalogoService extends Service {

    async getAllCatalogo(params: Record<string, string>): Promise<AxiosResponse<ApiResponse<ExercicioCatalogo[]>>> {
        const filteredParams: Record<string, string> = {};
        Object.keys(params).forEach((key) => {
            if (params[key]) {
                filteredParams[key] = params[key];
            }
        });
        return this.get<ApiResponse<ExercicioCatalogo[]>>('/api/catalogo', {
            params: filteredParams,
        });
    }

    async createExercicio(data: Omit<ExercicioCatalogo, 'id'>): Promise<AxiosResponse<ApiResponse<ExercicioCatalogo>>> {
        return this.post<ApiResponse<ExercicioCatalogo>>('/api/catalogo', data);
    }

    async updateExercicio(id: number, data: Partial<ExercicioCatalogo>): Promise<AxiosResponse<ApiResponse<ExercicioCatalogo>>> {
        return this.patch<ApiResponse<ExercicioCatalogo>>(`/api/catalogo/${id}`, data);
    }

    async deleteExercicio(id: number): Promise<AxiosResponse<ApiResponse<void>>> {
        return this.delete<ApiResponse<void>>(`/api/catalogo/${id}`);
    }
}

export default new CatalogoService();