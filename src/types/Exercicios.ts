export interface Exercicios {
   id: number;
   name: string;
   desc: string;
   sets: number;
   reps: number;
   rest: number;
   weight: string;
   tag: string;
   finalizado?: boolean;
}