import { Service } from './service';
import type { AxiosResponse } from 'axios';
import type { TreinoDoDia } from 'src/types/Exercicios.ts';
import type { PlanoTreino } from 'src/types/Exercicios'
import type { ApiResponse } from '../types/Response';

const urlBase = '/api/planos';
export class PlanosService extends Service {
    
    async getPlanoHoje(): Promise<AxiosResponse<ApiResponse<TreinoDoDia>>> {
       return this.get<ApiResponse<TreinoDoDia>>(urlBase + '/hoje');
    }

    async getPlanoDoDia(dia: number): Promise<AxiosResponse<ApiResponse<TreinoDoDia>>> {
       return this.get<ApiResponse<TreinoDoDia>>(urlBase + `/dia/${dia}`);
    }

    async getPlanosSemanais(): Promise<AxiosResponse<ApiResponse<TreinoDoDia>>> {
        return this.get<ApiResponse<TreinoDoDia>>(urlBase);
    }

    async getPlanos(): Promise<AxiosResponse<ApiResponse<PlanoTreino[]>>> {
       return this.get<ApiResponse<PlanoTreino[]>>(urlBase + '/');
    }

    async gerPlanoById(id: number): Promise<AxiosResponse<ApiResponse<PlanoTreino>>> {
       return this.get<ApiResponse<PlanoTreino>>(urlBase + `/${id}`);
    }

    async createPlano(data: Omit<PlanoTreino, 'id'>): Promise<AxiosResponse<ApiResponse<PlanoTreino>>> {
        return this.post<ApiResponse<PlanoTreino>>(urlBase + '/', data);
      }
    
      async updatePlano(id: number, data: Partial<PlanoTreino>): Promise<AxiosResponse<ApiResponse<PlanoTreino>>> {
          return this.patch<ApiResponse<PlanoTreino>>(`${urlBase}/${id}`, data);
      }

}

export default new PlanosService();