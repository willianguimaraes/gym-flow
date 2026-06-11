import type { AxiosResponse } from 'axios';
import { Service } from './service';
import type { Treino } from '../types/Exercicios';
import type { ApiResponse } from '../types/Response';

export class TreinoService extends Service {

  async getTreinos(): Promise<AxiosResponse<ApiResponse<Treino[]>>> {
    return this.get('/api/treinos');
  }

  async getById(id: number): Promise<AxiosResponse<ApiResponse<Treino>>> {
    return this.get<ApiResponse<Treino>>(`/api/treinos/${id}`);
  }

  async createTreino(data: Omit<Treino, 'id'>): Promise<AxiosResponse<ApiResponse<Treino>>> {
    return this.post<ApiResponse<Treino>>('/api/treinos/', data);
  }

  async updateTreino(id: number, data: Partial<Treino>): Promise<AxiosResponse<ApiResponse<Treino>>> {
      return this.patch<ApiResponse<Treino>>(`/api/treinos/${id}`, data);
  }
  // /**
  //  * Retorna a programação de treinos da semana inteira
  //  */
  // async getWeeklySchedule(): Promise<AxiosResponse<ApiResponse<DiasTreino[]>>> {
  //   return this.get<ApiResponse<DiasTreino[]>>('/api/workouts');
  // }

  // /**
  //  * Retorna o treino do dia atual
  //  */
  // async getTodayWorkout(): Promise<AxiosResponse<ApiResponse<DiasTreino>>> {
  //   return this.get<ApiResponse<DiasTreino>>('/api/workouts/today');
  // }

  // /**
  //  * Retorna o treino de um dia específico
  //  * @param day - Nome do dia da semana (seg, ter, qua, qui, sex, sab, dom)
  //  */
  // async getWorkoutByDay(day: string): Promise<AxiosResponse<ApiResponse<DiasTreino>>> {
  //   return this.get<ApiResponse<DiasTreino>>(`/api/workouts/${day}`);
  // }
}

export default new TreinoService();
