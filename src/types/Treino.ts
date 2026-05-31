import type { Exercicios } from './Exercicios';

export interface Treino {
    id: number, name: string, category: string, color: string,
    duration: number, kcal: number, difficulty: number,
    description: string,
    muscles: string[],
    exercises: Exercicios[]
}