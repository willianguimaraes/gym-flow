import { Service } from './service';
import type { AxiosResponse } from 'axios';
import type { TreinoDoDia } from 'src/types/Exercicios.ts';
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

}

export default new PlanosService();