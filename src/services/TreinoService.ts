import { Service } from './service';
import type { AxiosResponse } from 'axios';
import type { DiasTreino } from '../types/DiasTreino';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  available?: string[];
}

export class TreinoService extends Service {
  /**
   * Retorna a programação de treinos da semana inteira
   */
  async getWeeklySchedule(): Promise<AxiosResponse<ApiResponse<DiasTreino[]>>> {
    return this.get<ApiResponse<DiasTreino[]>>('/api/workouts');
  }

  /**
   * Retorna o treino do dia atual
   */
  async getTodayWorkout(): Promise<AxiosResponse<ApiResponse<DiasTreino>>> {
    return this.get<ApiResponse<DiasTreino>>('/api/workouts/today');
  }

  /**
   * Retorna o treino de um dia específico
   * @param day - Nome do dia da semana (seg, ter, qua, qui, sex, sab, dom)
   */
  async getWorkoutByDay(day: string): Promise<AxiosResponse<ApiResponse<DiasTreino>>> {
    return this.get<ApiResponse<DiasTreino>>(`/api/workouts/${day}`);
  }
}

export default new TreinoService();
